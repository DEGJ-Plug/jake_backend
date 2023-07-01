const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendEmail = require('../../utils/email');

const userSignUp = async (req, res) => {
  let {
    userName, email, password, role,
  } = req.body;
  userName = userName.toLowerCase();
  email = email.toLowerCase();
  try {
    const userEmailExists = await User.findOne({ email });
    if (userEmailExists) {
      return res.status(400).json({
        message: `${email} has already been registered, please login or reset your password`,
      });
    }
    const userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return res.status(400).json({
        message: `Sorry, the username '${userName}' has already been taken`,
      });
    }
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
      { expiresIn: process.env.JWT_VERIFICATION_EXP },
    );

    const verificationUrl = `http://localhost:8090/auth/verify?token=${token}`;
    // DANNY do we have to wait until the mail is sent before the registration process ends ??
    await sendEmail({
      email,
      subject: 'Welcome to Jake',
      text: 'Welcome to Jake',
      html: `<h1>Hey ${userName}, welcome to Jake, have a blast😉</h1> <p>please <a href=${verificationUrl}>verify</a> your account</p>`,
      message: 'Welcome to Jake',
    });

    return res.status(201).json({
      status: 'success',
      message: `${userName}, your account has been created successfully`,
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') { return res.status(400).json({ message: 'invalid request' }); }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET);
    const user = await User.findById({ _id: decodedToken.userId });

    if (user.isVerified) {
      return res.status(400).json({
        message: `Hey ${user.userName}, your account is already verified`,
      });
    }

    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: 'Your account has been verified successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res, next) => {
  const { emailuserName, password } = req.body;
  try {
    let userExists = await User.findOne({ email: emailuserName });
    if (!userExists) {
      userExists = await User.findOne({ userName: emailuserName });
    }
    if (userExists) {
      const validPassword = await bcrypt.compare(password, userExists.password);
      if (validPassword) {
        const token = jwt.sign(
          {
            userId: userExists._id,
            email: userExists.email,
            userName: userExists.userName,
          },
          process.env.JWT_VERIFICATION_SECRET,
          { expiresIn: process.env.JWT_LOGIN_EXP },
        );
        res.cookie('token', token);
        return res.status(200).json({
          success: true,
          data: {
            userId: userExists._id,
            userName: userExists.userName,
          },
        });
      }
      return res.status(401).send({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const profile = (req, res) => {
  const { user } = req;
  // const decode = jwt.decode(req.cookies.token, {});
  // const _exp = decode.exp * 1000;
  // const _date = new Date(_exp);
  // console.log(_date);
  res.status(200).send({ message: `Welcome back ${user.userName}`, user });
};
module.exports = {
  userSignUp,
  verifyUser,
  userLogin,
  profile,
};
