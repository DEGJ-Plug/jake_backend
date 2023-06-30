const nodemailer = require("nodemailer");

const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: SMTP_HOST,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `JaKe <${SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    message: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
