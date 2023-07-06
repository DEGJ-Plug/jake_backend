const jwt = require("jsonwebtoken");

const validToken = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const user = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET);
    req.user = user;
    return next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = validToken;
