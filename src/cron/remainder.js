import cron from "node-cron";
import { Issue } from "../models/issue.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  bookReminderEmail,
  overdueBookEmail,
} from "../services/remainderMail.js";

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Reminder Cron Running");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + 2);
    reminderDate.setHours(23, 59, 59, 999);

    // ✅ 1. Reminder emails
    const issues = await Issue.find({
      status: "issued",
      reminderSent: false,
      returnDate: { $gte: today, $lte: reminderDate },
    }).populate("user book");

    for (let issue of issues) {
      await sendEmail({
        to: issue.user.email,
        subject: "📚 Book Return Reminder",
        html: bookReminderEmail(
          issue.user.name,
          issue.book.title,
          issue.returnDate
        ),
      });

      issue.reminderSent = true;
      await issue.save();
    }

    // ❗ 2. Overdue emails (FIXED - prevent spam)
    const overdue = await Issue.find({
      status: "issued",
      overdueNotified: { $ne: true },
      returnDate: { $lt: today },
    }).populate("user book");

    for (let issue of overdue) {
      await sendEmail({
        to: issue.user.email,
        subject: "⚠️ Overdue Book Alert",
        html: overdueBookEmail(
          issue.user.name,
          issue.book.title,
          issue.returnDate
        ),
      });

      issue.overdueNotified = true;
      await issue.save();
    }

    console.log("✅ Reminder + Overdue emails sent");
  } catch (error) {
    console.error("❌ Cron Error:", error.message);
  }
});