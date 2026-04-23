import { Card } from "../models/card.js";
import User from "../models/user.js";
import { Counter } from "../models/counter.js";
import { sendEmail } from "../utils/sendEmail.js";
import { cardIssuedEmail , cardExpiryUpdatedEmail } from "../services/mail.js";

export const issueCard = async (req, res) => {
  try {
    const { userId, expiryDate } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(400).json({ message: "User is inactive" });
    }

    const existingCard = await Card.findOne({ user: userId });

    if (existingCard) {
      return res.status(400).json({
        message: "Card already issued",
      });
    }

    const counter = await Counter.findOneAndUpdate(
  { name: user.role }, 
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
);

const prefix = user.role === "teacher" ? "FAC" : "STU";
const year = String(new Date().getFullYear()).trim();

const cardNumber = `${prefix}-${year}-${String(counter.seq).padStart(3, "0")}`;


    const issue = new Date();

    let expiry;

    if (expiryDate) {
      expiry = new Date(expiryDate);
    } else {
      expiry = new Date(issue);

      if (user.role === "teacher") {
        expiry.setFullYear(expiry.getFullYear() + 2);
      } else if(user.role === "student") {
        expiry.setFullYear(expiry.getFullYear() + 1);
      }
    }

    if (expiry <= issue) {
      return res.status(400).json({
        message: "Expiry must be after issue date",
      });
    }

    const card = await Card.create({
      cardNumber,
      user: userId,
      role: user.role,
      issueDate: issue,
      expiryDate: expiry,
    });

    const cardissueHtml =cardIssuedEmail(
    user.name,
    cardNumber,
    issue.toDateString(),
    expiry.toDateString()
  )

    await sendEmail({
  to: user.email,
  subject: "Your Library Card Has Been Issued 🎉",
  html: cardissueHtml
});


    return res.status(201).json({
      message: "Card issued successfully",
      card,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

 // GET ALL CARDS
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find()
      .populate("user")
      .sort({ createdAt: -1 });
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// update 

export const updateCardExpiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiryDate } = req.body;

    if (!expiryDate) {
      return res.status(400).json({
        message: "Expiry date is required",
      });
    }

    const card = await Card.findById(id).populate("user");

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const newExpiry = new Date(expiryDate);

    if (isNaN(newExpiry.getTime())) {
      return res.status(400).json({
        message: "Invalid expiry date",
      });
    }

    if (newExpiry <= card.issueDate) {
      return res.status(400).json({
        message: "Expiry must be after issue date",
      });
    }

    card.expiryDate = newExpiry;
    await card.save();

    try {
     await sendEmail({
  to: card.user.email,
  subject: "Library Card Expiry Updated 🔔",
  html: cardExpiryUpdatedEmail(
    card.user.name,
    card.cardNumber,
    card.expiryDate.toDateString(),
    newExpiry.toDateString()
  ),
});
      
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    console.log("Sending email to:", card.user.email);

    return res.status(200).json({
      message: "Card expiry updated successfully",
      data: card,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Pagination
export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const role = req.query.role;
    const search = req.query.search || "";

    const matchStage = {
      ...(role && role !== "all" ? { "user.role": role } : {}),
      ...(search
        ? {
            $or: [
              { "user.name": { $regex: search, $options: "i" } },
              { "user.email": { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const result = await Card.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      { $match: matchStage },

      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const cards = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      page,
      limit,
      total,
      totalPages,
      data: cards,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// dashboardstats

export const getDashboardStats=async(req,res)=>{
  try{
    const cards = await Card.find().populate("user", "status");
   const totalCount=await Card.countDocuments();
     let active = 0;
    let inactive = 0;

    cards.forEach((card) => {
      if (card.user?.status === "active") {
        active++;
      } else {
        inactive++;
      }
    });

    return res.json({
      total: totalCount,
      active,
      inactive
     })
  }
  catch(error){
   return res.status(500).json({message:error.message})
  }
}