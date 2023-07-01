const jwt = require('jsonwebtoken');

const validToken = (req, res, next) => {
  const { token } = req.cookies;
  try {
    const user = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET);
    req.user = user;
    return next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).send({ error: 'Invalid user token' });
    // return res.redirect('/');
  }
};

module.exports = validToken;
