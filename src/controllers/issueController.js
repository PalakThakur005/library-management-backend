import { Issue } from "../models/issue.js";
import User from "../models/user.js";
import { Book } from "../models/Books.js";
import { sendEmail } from "../utils/sendEmail.js";
import { issuedBookEmail, bookReturnedEmail, issueUpdatedEmail } from "../services/mail.js";



export const calculateFine = (issue, today = new Date()) => {
  if (!issue.returnDate) return 0;

  if (issue.status === "returned") {
    return issue.fine || 0;
  }

  const currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  if (!issue.fineClearedAt) {
    const dueDate = new Date(issue.returnDate);
    dueDate.setHours(0, 0, 0, 0);

    if (currentDate <= dueDate) return 0;

    const overdueDays = Math.floor(
      (currentDate - dueDate) / (1000 * 60 * 60 * 24)
    );

    return overdueDays * 10;
  }

  const clearDate = new Date(issue.fineClearedAt);
  clearDate.setHours(0, 0, 0, 0);

  if (currentDate <= clearDate) return 0;

  const newLateDays = Math.floor(
    (currentDate - clearDate) / (1000 * 60 * 60 * 24)
  );

  return newLateDays * 10;
};

// ================= ISSUE BOOK =================
export const issueBook = async (req, res) => {
  try {
    const { userId, bookId, returnDate } = req.body;

    const user = await User.findById(userId).populate("department");
    if (!user || user.status !== "active") {
      return res.status(400).json({ message: "User not active" });
    }

    const book = await Book.findById(bookId);
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }



    const alreadyIssued = await Issue.findOne({
      user: userId,
      book: bookId,
      status: "issued",
    });

    if (alreadyIssued) {
      return res.status(400).json({
        message: "Book already issued to this user",
      });
    }

    const count = await Issue.countDocuments({
      user: userId,
      status: "issued",
    });

    if (count >= 3) {
      return res.status(400).json({
        message: "User reached max limit (3 books)",
      });
    }

    const today = new Date();

    const overdueIssue = await Issue.findOne({
      user: userId,
      status: "issued",
      returnDate: { $lt: today },
    }).populate("book", "title");

    if (overdueIssue) {
      return res.status(400).json({
message: `Please return the overdue book ("${overdueIssue.book.title}") before issuing a new one.`,      });
    }

    const selectedDate = new Date(returnDate);
    selectedDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate <= currentDate) {
      return res.status(400).json({
        message: "Return date must be a future date",
      });
    }

    const issue = await Issue.create({
      user: user._id,
      book: bookId,
      returnDate,
      department: user.department._id
    });

    book.quantity -= 1;
    await book.save();

    const issuedBookHtml = issuedBookEmail(user, book, issue);


    await sendEmail({
      to: user.email,
      subject: "📚 Book Issued Successfully",
      html: issuedBookHtml,
    });

    res.status(201).json({
      message: "Book issued successfully",
      issue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get 

export const getIssue = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate({
        path: "user",
        select: "name email role department",
        populate: {
          path: "department",
          select: "name"
        }
      })
      .populate("book", "title isbn")
      .sort({ createdAt: -1 });


    return res.status(200).json(issues);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//==========clear fine =========


export const clearFine = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const pendingFine = calculateFine(issue);

    if (pendingFine <= 0) {
      return res.status(400).json({
        message: "No fine pending",
      });
    }

    issue.fine = pendingFine;
    issue.fineClearedAt = new Date();

    await issue.save();

    return res.status(200).json({
      message: `Fine of ₹${pendingFine} cleared successfully`,
      paidFine: pendingFine,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= RETURN BOOK =================
export const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("book")
      .populate("user");

    if (!issue) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    if (issue.status === "returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    const pendingFine = calculateFine(issue);

    if (pendingFine > 0) {
      return res.status(400).json({
        message: `Please clear your fine of ₹${pendingFine} before returning this book`,
        pendingFine,
      });
    }

    issue.status = "returned";
    await issue.save();

    const book = await Book.findById(issue.book._id);

    if (book) {
      book.quantity += 1;
      await book.save();
    }

    await sendEmail({
      to: issue.user.email,
      subject: "📘 Book Returned Successfully",
      html: bookReturnedEmail(
        issue.user.name,
        issue.book.title,
        new Date().toLocaleDateString("en-IN"),
        issue.fine || 0
      ),
    });

    return res.status(200).json({
      message: "Book returned successfully",
      finePaid: issue.fine || 0,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET ISSUED BOOKS =================
export const getIssuedBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role || "all";
    const status = req.query.status || "";

    let matchStage = {
      $or: [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
        { "book.title": { $regex: search, $options: "i" } },
      ],
    };

    if (role !== "all") {
      matchStage["user.role"] = role;
    }

    if (status) {
      matchStage["status"] = status;
    }

    const data = await Issue.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "departments",
          localField: "user.department",
          foreignField: "_id",
          as: "user.department",
        },
      },
      {
        $unwind: {
          path: "$user.department",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      {
        $addFields: {
          fine: {
            $cond: [
              { $eq: ["$status", "returned"] },
              { $ifNull: ["$fine", 0] },

              {
                $cond: [
                  {
                    $gt: [
                      {
                        $cond: [
                          { $ifNull: ["$fineClearedAt", false] },
                          {
                            $divide: [
                              { $subtract: [new Date(), "$fineClearedAt"] },
                              1000 * 60 * 60 * 24
                            ]
                          },
                          {
                            $divide: [
                              { $subtract: [new Date(), "$returnDate"] },
                              1000 * 60 * 60 * 24
                            ]
                          }
                        ]
                      },
                      0
                    ]
                  },
                  {
                    $multiply: [
                      {
                        $floor: {
                          $cond: [
                            { $ifNull: ["$fineClearedAt", false] },
                            {
                              $divide: [
                                { $subtract: [new Date(), "$fineClearedAt"] },
                                1000 * 60 * 60 * 24
                              ]
                            },
                            {
                              $divide: [
                                { $subtract: [new Date(), "$returnDate"] },
                                1000 * 60 * 60 * 24
                              ]
                            }
                          ]
                        }
                      },
                      10
                    ]
                  },
                  0
                ]
              }
            ]
          }
        }
      },

      { $match: matchStage },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Issue.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "departments",
          localField: "user.department",
          foreignField: "_id",
          as: "user.department",
        },
      },
      {
        $unwind: {
          path: "$user.department",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      { $match: matchStage },

      { $count: "total" },
    ]);

    res.json({
      data,
      page,
      totalPages: Math.ceil((total[0]?.total || 0) / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// ================= UPDATE ISSUE =================
export const updateIssue = async (req, res) => {
  try {
    const { returnDate } = req.body || {};

    if (!returnDate) {
      return res.status(400).json({
        message: "Return date is required",
      });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("user")
      .populate("book");

    if (!issue) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (issue.status === "returned") {
      return res.status(400).json({
        message: "Cannot update returned book",
      });
    }

    if (issue.user.status === "inactive") {
      return res.status(400).json({
        message: "User is inactive",
      });
    }

    const oldReturnDate = issue.returnDate;
    const selectedDate = new Date(returnDate);
    selectedDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate <= currentDate) {
      return res.status(400).json({
        message: "Return date must be a future date",
      });
    }

    issue.returnDate = new Date(returnDate);
    await issue.save();

    try {
      await sendEmail({
        to: issue.user.email,
        subject: "📅 Return Date Updated",
        html: issueUpdatedEmail(
          issue.user?.name,
          issue.book?.title,
          new Date(oldReturnDate).toLocaleDateString("en-IN"),
          new Date(returnDate).toLocaleDateString("en-IN")
        ),
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return res.json({
      message: "Updated successfully",
      issue,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




//card



export const getIssueStats = async (req, res) => {
  try {
    const totalIssued = await Issue.countDocuments();

    const returned = await Issue.countDocuments({
      status: "returned",
    });

    const issued = await Issue.countDocuments({
      status: "issued",
    });

    const overdue = await Issue.countDocuments({
      status: "issued",
      returnDate: { $lt: new Date() },
    });

    return res.status(200).json({
      totalIssued,
      issued,
      returned,
      overdue,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//   particular user see only book that issue

export const getMyIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const issuedBooks = await Issue.find({ user: userId })
      .populate("book", "title author isbn")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    const today = new Date();

    const updatedBooks = issuedBooks.map((item) => {
      const fine = calculateFine(item);

      return {
        ...item._doc,
        fine,
        status:
          item.status === "issued" && fine > 0
            ? "overdue"
            : item.status,
      };
    });
    res.status(200).json(updatedBooks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fined books

export const getFinedBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role || "all";

    const baseMatch = {
      $or: [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
        { "book.title": { $regex: search, $options: "i" } },
      ],
    };

    if (role !== "all") {
      baseMatch["user.role"] = role;
    }

    const pipeline = [
      // ================= USER =================
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "departments",
          localField: "user.department",
          foreignField: "_id",
          as: "user.department",
        },
      },
      {
        $unwind: {
          path: "$user.department",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ================= BOOK =================
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      // ================= FINE CALCULATION =================
      {
        $addFields: {
          fine: {
            $cond: [
              { $eq: ["$status", "returned"] },
              "$fine",
              {
                $cond: [
                  {
                    $ifNull: ["$fineClearedAt", false]
                  },
                  {
                    $multiply: [
                      {
                        $floor: {
                          $divide: [
                            { $subtract: [new Date(), "$fineClearedAt"] },
                            1000 * 60 * 60 * 24
                          ]
                        }
                      },
                      10
                    ]
                  },
                  {
                    $multiply: [
                      {
                        $floor: {
                          $divide: [
                            { $subtract: [new Date(), "$returnDate"] },
                            1000 * 60 * 60 * 24
                          ]
                        }
                      },
                      10
                    ]
                  }
                ]
              }
            ]
          },
        },
      },

      {
        $match: {
          fine: { $gt: 0 },
          ...baseMatch,
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await Issue.aggregate(pipeline);

    const countPipeline = [
      ...pipeline.slice(0, -3),
      {
        $match: {
          fine: { $gt: 0 },
          ...baseMatch,
        },
      },
      { $count: "total" },
    ];

    const totalResult = await Issue.aggregate(countPipeline);

    res.status(200).json({
      data,
      page,
      totalPages: Math.ceil((totalResult[0]?.total || 0) / limit),
      totalRecords: totalResult[0]?.total || 0,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};