// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// async function sendTestEmail() {
//   const pdfPath = path.join(process.cwd(), "test.pdf");
//   fs.writeFileSync(pdfPath, "Test PDF Content");

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.EMAIL_USER,
//     subject: "Test Email with PDF",
//     text: "This is a test email with a PDF attachment.",
//     attachments: [{ filename: "test.pdf", path: pdfPath }],
//   };

//   await transporter.sendMail(mailOptions);
//   console.log("✅ Test email sent!");
// }

// sendTestEmail().catch(console.error);
