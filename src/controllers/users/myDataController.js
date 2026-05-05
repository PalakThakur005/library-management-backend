 import { Issue } from "../../models/issue.js";
 import User from "../../models/user.js";
 import { Card } from "../../models/card.js";
 import {calculateFine} from "../issueController.js"
 






export const getMyIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const today = new Date();

    const allBooks = await Issue.find({ user: userId });

    let totalIssued = allBooks.length;
    let returned = 0;
    let overdue = 0;
    let activeIssued = 0;

    allBooks.forEach((item) => {
      const isOverdue =
        item.status === "issued" &&
        item.returnDate &&
        new Date(item.returnDate) < today;

      if (item.status === "returned") returned++;
      else if (isOverdue) overdue++;
      else if (item.status === "issued") activeIssued++;
    });

    const issuedBooks = await Issue.find({ user: userId })
      .populate("book", "title author isbn")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const updatedBooks = issuedBooks.map((item) => {
      const fine = calculateFine(item);

      const isOverdue =
        item.status === "issued" &&
        item.returnDate &&
        new Date(item.returnDate) < today;

      return {
        ...item._doc,
        fine,
        status: isOverdue ? "overdue" : item.status,
      };
    });

    return res.status(200).json({
      success: true,
      data: updatedBooks,
      stats: {
        totalIssued,
        activeIssued,
        returned,
        overdue,
      },
      pagination: {
        total: totalIssued,
        page,
        limit,
        totalPages: Math.ceil(totalIssued / limit),
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// get my card 



export const getMyCard = async (req, res) => {
  try {
    const userId = req.user.id;

    const card = await Card.findOne({ user: userId })
      .populate("user", "name email role status");

   

    return res.status(200).json({
      success: true,
      card,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMyFineBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const today = new Date();

    const issues = await Issue.find({})
      .populate("book", "title author isbn")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const finedBooks = issues
      .map((item) => {
        const fine = calculateFine(item);

        const isOverdue =
          item.status === "issued" &&
          item.returnDate &&
          new Date(item.returnDate) < today;

        return {
          ...item._doc,
          fine,
          status: isOverdue ? "overdue" : item.status,
        };
      })
      .filter((item) => item.fine > 0);

    const total = finedBooks.length;

    const paginated = finedBooks.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};