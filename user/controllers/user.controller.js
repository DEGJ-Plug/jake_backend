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

    const verificationUrl = `http://localhost:${process.env.PORT}/auth/verify?token=${token}`;
    // DANNY do we have to wait until the mail is sent before the registration process ends ??
    await sendEmail({
      email,
      subject: 'Account Verification',
      text: '',
      html: `Hey ${userName},<p>Welcome to Jake, kindly <a href=${verificationUrl}>verify</a> your account<p>`,
      message: 'Verification',
    });

    return res.status(201).json({
      status: 'success',
      message: `${userName}, your account has been created successfully`,
      userId: newUser._id,
      tokenExpiration: '48 hours',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'invalid request' });
  }

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
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Jake',
      text: '',
      html: `Hey ${user.userName},<p>Your account has been verified successfully.<p><p>Enjoy Jake</p>`,
      message: 'Welcome to Jake',
    });
    return res
      .status(200)
      .json({ message: 'Your account has been verified successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { emailUserName, password } = req.body;
  try {
    const userExists = await User.findOne({
      $or: [{ email: emailUserName }, { userName: emailUserName }],
    });
    // console.log(emailUserName);
    if (!userExists) {
      return res
        .status(400)
        .json({ message: 'user does not exist, please sign up' });
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
    }
    return res.status(401).send({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  // const decode = jwt.decode(req.cookies.token, {});
  // const _exp = decode.exp * 1000;
  // const _date = new Date(_exp);
  // console.log(_date);
  const existingUser = await User.findOne({
    userName: user.userName,
    email: user.email,
  });
  // console.log(existingUser);
  if (existingUser) {
    return res
      .status(200)
      .send({ message: `Welcome back ${user.userName}`, user });
  }
  res.clearCookie('token');
  return res.status(401).redirect('/');
};

async function resetToken(req, res) {
  const { email } = req.body;
  // send a mail with reset token
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
          email,
        },
        process.env.JWT_VERIFICATION_SECRET,
        { expiresIn: process.env.JWT_LOGIN_EXP },
      );
      const resetLink = `${process.env.SITE_URL}:${process.env.PORT}/reset-password/${token}`;
      await sendEmail({
        email,
        subject: 'Password Reset',
        html: `Hi ${user.userName},<p>Follow the <a href=${resetLink}>link</a> provided to reset your password.</p><p>Simply delete this mail if you did not request a password reset</p>`,
      });
      return res
        .status(200)
        .json({ message: 'Kindly visit your email inbox or spam and follow the link to reset your password' });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
  return res.status(400).send({ error: 'email does not exist, please sign up' });
}
async function resetPassword(req, res) {
  const { password, verifyPassword } = req.body;
  try {
    if (password !== verifyPassword) {
      throw new Error('Passwords do not match');
    }
    const userObj = req.user;
    const user = await User.findById({ _id: userObj.userId });
    if (!user) {
      throw new Error('Unauthorized');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.save();
    res.status(201).send({ success: 'password updated' });
  } catch (error) {
    // console.log(error);
    res.status(401).send({ error: error.message });
  }
}

module.exports = {
  userSignUp,
  verifyUser,
  userLogin,
  profile,
  resetToken,
  resetPassword,
};
