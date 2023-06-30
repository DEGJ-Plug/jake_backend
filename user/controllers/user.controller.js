const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../../utils/email");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  let { userName, email, password, role } = req.body;
  userName = userName.toLowerCase();
  email = email.toLowerCase();
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        message: `Hello ${userName} you already have an account, please login`,
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
      role,
    });

    const token = jwt.sign(
      { email, userId: newUser._id, userName },
      process.env.JWT_VERIFICATION_SECRET,
      { expiresIn: process.env.JWT_VERIFICATION_EXP }
    );

    const verificationUrl = `http://localhost:8090/auth/verify?token=${token}`;

    await sendEmail({
      email,
      subject: "Welcome to JaKe",
      text: "Welcome to JaKe",
      html: `<h1>Hey ${userName}, welcome to JaKe, have a blast😉</h1> <p>please click the link to verify your account ${verificationUrl} </p>`,
      message: "Welcome to JaKe",
    });

    return res.status(201).json({
      status: "success",
      message: `${userName}, your account has been created successfully`,
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string")
    return res.status(400).json({ message: "invalid request" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET);
    const user = await User.findById({ _id: decodedToken.userId });

    if (user.isVerified)
      return res.status(400).json({
        message: `Hey ${user.userName}, your account is already verified`,
      });

    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "Your account has been verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userSignUp,
  verifyUser,
};
