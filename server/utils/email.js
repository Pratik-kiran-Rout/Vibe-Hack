const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

const sendBlogStatusEmail = async (userEmail, username, blogTitle, status) => {
  const statusMessages = {
    approved: {
      subject: 'Your blog has been approved!',
      message: `Congratulations! Your blog "${blogTitle}" has been approved and is now live on DevNote.`
    },
    rejected: {
      subject: 'Blog submission update',
      message: `We're sorry, but your blog "${blogTitle}" was not approved for publication. Please review our guidelines and feel free to submit again.`
    },
    hidden: {
      subject: 'Blog visibility update',
      message: `Your blog "${blogTitle}" has been temporarily hidden from public view.`
    }
  };

  const { subject, message } = statusMessages[status];
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${username},</h2>
      <p style="font-size: 16px; line-height: 1.6;">${message}</p>
      <p style="font-size: 14px; color: #666;">
        Thank you for being part of the DevNote community!
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">
        This is an automated email from DevNote. Please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail(userEmail, subject, html);
};

module.exports = { sendEmail, sendBlogStatusEmail };