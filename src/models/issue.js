import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["issued", "returned" , "overdue"],
    default: "issued",
  },
  reminderSent: {
     type: Boolean, 
     default: false
     },
     fineClearedAt: {
  type: Date,
  default: null
},
}, {timestamps:true});

export const Issue = mongoose.model("Issue", issueSchema);