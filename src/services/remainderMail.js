
export const bookReminderEmail = (name, bookTitle, returnDate) => {
  return `
  <div style="font-family:Arial;background:#f4f6f8;padding:20px;">

    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:#f59e0b;color:#fff;padding:16px;text-align:center;">
        <h2 style="margin:0;">📚 Book Return Reminder</h2>
      </div>

      <!-- BODY -->
      <div style="padding:20px;color:#333;">

        <p>Hi <b>${name}</b>,</p>

        <p>
          This is a reminder that your borrowed book is due soon.
        </p>

        <div style="margin-top:15px;padding:15px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;">
          <p style="margin:6px 0;">📖 <b>Book:</b> ${bookTitle}</p>
          <p style="margin:6px 0;">📅 <b>Due Date:</b> ${new Date(returnDate).toDateString()}</p>
        </div>

        <p style="margin-top:15px;color:#dc2626;font-size:13px;">
          ⚠ Please return the book on time to avoid fines.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="text-align:center;font-size:12px;color:#888;padding:10px;background:#f4f6f8;">
        Library Management System © ${new Date().getFullYear()}
      </div>

    </div>
  </div>
  `;
};



export const overdueBookEmail = (name, bookTitle) => {
  return `
  <div style="font-family:Arial;background:#f4f6f8;padding:20px;">

    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">

      <div style="background:#dc2626;color:#fff;padding:16px;text-align:center;">
        <h2 style="margin:0;">⚠️ Overdue Book Alert</h2>
      </div>

      <div style="padding:20px;">

        <p>Hi <b>${name}</b>,</p>

        <p>Your book is overdue. Please return it immediately.</p>

        <div style="background:#fef2f2;padding:15px;border-radius:10px;">
          📖 <b>${bookTitle}</b>
        </div>

      </div>

      <div style="text-align:center;font-size:12px;color:#888;padding:10px;">
        Library Management System
      </div>

    </div>
  </div>
  `;
};