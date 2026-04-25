export const resetPassword = (name, email, newPassword) => {
      const loginUrl = "https://library-management-frontend-puce-three.vercel.app/login";

  return `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">


      <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       
        <h2 style="margin:10px 0 0;">  🔐 Password Reset</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>


       <div style="padding:25px;">

    <p style="color:#374151; font-size:14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="color:#4b5563; font-size:14px; line-height:1.6;">
      Your password has been reset by admin.
    </p>

    <div style="
      background:#f9fafb;
      padding:15px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      margin-top:10px;
    ">

      <p style="margin:6px 0; color:#374151;">
        <strong>Email:</strong> ${email}
      </p>

      <p style="margin:6px 0; color:#dc2626;">
        <strong>New Password:</strong> ${newPassword}
      </p>
      </div>

      
     <!-- LOGIN BUTTON -->
        <div style="text-align:start;margin-top:25px;">
          <a href="${loginUrl}" 
             style="
               display:inline-block;
               padding:12px 20px;
               background: #2d6c93;
               color:white;
               text-decoration:none;
               border-radius:8px;
               font-size:14px;
               font-weight:bold;
             ">
            🔐 Login to Your Account
          </a>
        </div>

  

    <p style="font-size: 13px; margin-top: 20px; color:#6b7280;">
      Regards,<br/>
      <strong style="color:#111827;">LibraSync Team</strong>
    </p>
    </div>

    <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

  </div>
</div>

  `;
};


export const registerEmail = (name, email, plainPassword) => {
      const loginUrl = "https://library-management-frontend-puce-three.vercel.app/login";
 return   `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">  Welcome to LibraSync </br> Library System</h2>
       
      </div>

    <div style="padding:25px;">
    <p style="color:#374151; font-size:14px;">
      Hello <strong>${name}</strong>,
    </p>
    <p style="color:#4b5563; font-size:14px; line-height:1.6;">
      Your account has been successfully created. You can now log in using the credentials below:
    </p>

    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 5px 0;"><strong>Password:</strong> ${plainPassword}</p>
    </div>
    <!-- LOGIN BUTTON -->
        <div style="text-align:start;margin-top:25px;">
          <a href="${loginUrl}" 
             style="
               display:inline-block;
               padding:12px 20px;
                 background: #2d6c93;
               color:white;
               text-decoration:none;
               border-radius:8px;
               font-size:14px;
               font-weight:bold;
             ">
            🔐 Login to Your Account
          </a>
        </div>


    <p style="font-size: 13px; margin-top: 20px;">
      Regards,<br/>
      <strong>LibraSync Team</strong>
    </p>
    </div>

    <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

  </div>
</div>
`
}


export const userUpdatedEmail = (name, email, role, department) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">
    
    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">
      
     <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">  User Details Updated</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;">
        
        <p style="font-size:16px;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          Your account details have been successfully updated by the administrator.
        </p>

        <!-- INFO BOX -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;">
            <strong>Name:</strong> ${name}
          </p>

          <p style="margin:8px 0;">
            <strong>Email:</strong> ${email}
          </p>

          <p style="margin:8px 0;">
            <strong>Role:</strong> ${role}
          </p>

          <p style="margin:8px 0;">
            <strong>Department:</strong> ${department || "N/A"}
          </p>

        </div>

        <!-- NOTE BOX -->
        <div style="
          margin-top:20px;
          padding:12px;
          background:#eef2ff;
          border-left:4px solid #6366f1;
          border-radius:8px;
        ">
          <p style="margin:0;color:#3730a3;font-size:13px;">
            If you did not request this update, please contact the administrator immediately.
          </p>
        </div>

      </div>

      <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

    </div>
  </div>
  `;
};


export const ContactAdmin = (name, email, message) => {
 return `
<div style="font-family: Arial, sans-serif; background:#f3f4f6; padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

     <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;"> 📩 User Request</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

    <!-- Body -->
    <div style="padding:25px;">

      <div style="margin-bottom:15px;">
        <p style="margin:0; font-size:13px; color:#6b7280;">Name</p>
        <p style="margin:5px 0; font-size:16px; font-weight:bold; color:#111827;">
          ${name}
        </p>
      </div>

      <div style="margin-bottom:15px;">
        <p style="margin:0; font-size:13px; color:#6b7280;">Email</p>
        <p style="margin:5px 0; font-size:16px; font-weight:bold; color:#111827;">
          ${email}
        </p>
      </div>

      <div style="margin-top:20px;">
        <p style="margin:0; font-size:13px; color:#6b7280;">Message</p>

        <div style="
          margin-top:8px;
          padding:15px;
          background:#f9fafb;
          border-left:4px solid #3b82f6;
          border-radius:8px;
          font-size:14px;
          color:#374151;
          line-height:1.6;
        ">
          ${message}
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:15px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
      Sent from <strong>LibraSync</strong> Contact System
    </div>

  </div>
</div>
`
}


export const cardIssuedEmail = (name, cardNumber, issueDate, expiryDate) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

     <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">Library Card Issued</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;">

        <p style="font-size:16px;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          Your library card has been successfully issued. You can now borrow books from the library.
        </p>

        <!-- INFO BOX -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;">
            <strong>Card Number:</strong> ${cardNumber}
          </p>

          <p style="margin:8px 0;">
            <strong>Issue Date:</strong> ${issueDate}
          </p>

          <p style="margin:8px 0;">
            <strong>Expiry Date:</strong> ${expiryDate}
          </p>

        </div>

        <!-- WARNING BOX -->
        <div style="
          margin-top:20px;
          padding:12px;
          background:#ecfdf5;
          border-left:4px solid #10b981;
          border-radius:8px;
        ">
          <p style="margin:0;color:#065f46;font-size:13px;">
            Please keep your card details safe and do not share them with anyone.
          </p>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        text-align:center;
        font-size:12px;
        color:#9ca3af;
        padding:15px;
        border-top:1px solid #e5e7eb;
      ">
        © ${new Date().getFullYear()} LibraSync Library Management System<br/>
        This is an automated message, please do not reply.
      </div>

    </div>
  </div>
  `;
};



export const cardExpiryUpdatedEmail = (name, cardNumber, expiry, newExpiry) => {
  return `
  <div style="font-family:Arial, sans-serif;background:#f3f4f6;padding:30px;">

    <!-- MAIN CARD -->
    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">🔔 Card Expiry Updated</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;color:#111827;">

        <div style="
          display:inline-block;
          padding:5px 10px;
          background:#eef2ff;
          color:#3730a3;
          border-radius:20px;
          font-size:12px;
          margin-bottom:15px;
        ">
          SYSTEM NOTIFICATION
        </div>

        <p style="font-size:16px;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          Your library card expiry date has been updated by the administrator.
        </p>

        <!-- INFO BOX -->
        <div style="
          margin-top:15px;
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
        ">

          <p style="margin:8px 0;">
            <strong>Card Number:</strong> ${cardNumber}
          </p>

          <p style="margin:8px 0;">
            <strong>Old Expiry Date:</strong> ${expiry}
          </p>

          <p style="margin:8px 0;color:#16a34a;">
            <strong>New Expiry Date:</strong> ${newExpiry}
          </p>

        </div>

        <!-- WARNING -->
        <div style="
          margin-top:20px;
          padding:12px;
          background:#fff7ed;
          border-left:4px solid #f59e0b;
          border-radius:8px;
        ">
          <p style="margin:0;color:#9a3412;font-size:13px;">
            Please make sure your card remains valid for library access.
          </p>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        text-align:center;
        font-size:12px;
        color:#9ca3af;
        padding:15px;
        border-top:1px solid #e5e7eb;
      ">
        © ${new Date().getFullYear()} LibraSync Library Management System<br/>
        This is an automated message, please do not reply.
      </div>

    </div>
  </div>
  `;
};



export const issuedBookEmail = (user, book, issue) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

       <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">  📚 Book Issued Successfully</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;">

        <p style="font-size:16px;">
          Hello <strong>${user.name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          You have successfully been issued a book from the library.
        </p>

        <!-- BOOK CARD -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;font-size:15px;">
            📖 <strong>${book.title}</strong>
          </p>

          <p style="margin:8px 0;">
            <strong>Department:</strong> ${user.department?.name || "N/A"}
          </p>

          <p style="margin:8px 0;">
            <strong>Return Date:</strong> 
            <span style="color:#dc2626;">
              ${new Date(issue.returnDate).toDateString()}
            </span>
          </p>

        </div>

        <!-- WARNING -->
        <div style="
          margin-top:20px;
          padding:12px;
          background:#fff7ed;
          border-left:4px solid #f59e0b;
          border-radius:8px;
        ">
          <p style="margin:0;color:#9a3412;font-size:13px;">
            Please return the book before the due date to avoid fines.
          </p>
        </div>

      </div>

        <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

    </div>
  </div>
  `;
};



export const bookReturnedEmail = (name, bookTitle, returnDate, fine) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">



       <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;">  📘 Book Returned</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;">

        <p style="font-size:16px;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          Thank you for returning your book successfully.
        </p>

        <!-- DETAILS -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;">
            📖 <strong>Book:</strong> ${bookTitle}
          </p>

          <p style="margin:8px 0;">
            📅 <strong>Return Date:</strong> ${returnDate}
          </p>

          <p style="margin:8px 0;">
            💰 <strong>Fine:</strong> ₹${fine}
          </p>

        </div>

        ${
          fine > 0
            ? `
          <div style="
            margin-top:20px;
            padding:12px;
            background:#fff7ed;
            border-left:4px solid #f59e0b;
            border-radius:8px;
          ">
            <p style="margin:0;color:#9a3412;font-size:13px;">
              ⚠ Please clear your fine at the library counter.
            </p>
          </div>
          `
            : `
          <div style="
            margin-top:20px;
            padding:12px;
            background:#ecfdf5;
            border-left:4px solid #16a34a;
            border-radius:8px;
          ">
            <p style="margin:0;color:#065f46;font-size:13px;">
              ✅ No fine charged. Thank you for returning on time!
            </p>
          </div>
          `
        }

      </div>

      <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

    </div>
  </div>
  `;
};





export const issueUpdatedEmail = (name, bookTitle, oldReturnDate, newReturnDate) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

        <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;"> 📅 Return Date Updated</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Library System
        </p>
      </div>

      <div style="padding:25px;">

        <p style="font-size:16px;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          The return date for your issued book has been updated by the administrator.
        </p>

        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;">
            📖 <strong>Book:</strong> ${bookTitle}
          </p>

          <p style="margin:8px 0;">
            📅 <strong>Old Return Date:</strong> ${oldReturnDate}
          </p>

          <p style="margin:8px 0;color:#16a34a;">
            📅 <strong>New Return Date:</strong> ${newReturnDate}
          </p>

        </div>

        <div style="
          margin-top:20px;
          padding:12px;
          background:#fff7ed;
          border-left:4px solid #f59e0b;
          border-radius:8px;
        ">
          <p style="margin:0;color:#9a3412;font-size:13px;">
            Please check your updated due date and return the book on time.
          </p>
        </div>

      </div>

        <!-- FOOTER -->
    <div style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #e5e7eb;
      text-align:center;
      font-size:12px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} LibraSync Library Management System<br/>
      This is an automated message, please do not reply.
    </div>

    </div>
  </div>
  `;
};


export const departmentAddedEmail = (name, code, location, description) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:30px;">

    <div style="max-width:600px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

          <!-- HEADER -->
      <div style="
        background: linear-gradient(to right, #2d6c93, #1e5272);
        padding:25px;
        text-align:center;
        color:white;
      ">

       

        <h2 style="margin:10px 0 0;"> 🏢 New Department Added</h2>
        <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
          LibraSync Admin Notification
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:25px;">

        <p style="font-size:16px;">
          Hello Admin,
        </p>

        <p style="color:#4b5563;line-height:1.6;">
          A new department has been successfully created in the system.
        </p>

        <!-- INFO BOX -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">

          <p style="margin:8px 0;">
            🏢 <strong>Department Name:</strong> ${name}
          </p>

          <p style="margin:8px 0;">
            🆔 <strong>Department Code:</strong> ${code}
          </p>

          <p style="margin:8px 0;">
            📍 <strong>Location:</strong> ${location || "N/A"}
          </p>

          <p style="margin:8px 0;">
            📝 <strong>Description:</strong> ${description || "N/A"}
          </p>

        </div>

        <div style="
          margin-top:20px;
          padding:12px;
          background:#eef2ff;
          border-left:4px solid #6366f1;
          border-radius:8px;
        ">
          <p style="margin:0;color:#3730a3;font-size:13px;">
            You can now assign teachers and students to this department.
          </p>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        text-align:center;
        font-size:12px;
        color:#9ca3af;
        padding:15px;
        border-top:1px solid #e5e7eb;
      ">
        © ${new Date().getFullYear()} LibraSync Library Management System
      </div>

    </div>
  </div>
  `;
};



