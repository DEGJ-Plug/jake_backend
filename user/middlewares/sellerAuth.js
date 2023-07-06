const sellerAuth = (req, res, next) => {
  if (req.user.role !== "seller") return res.status(403).json("Forbidden");
  next();
};

module.exports = sellerAuth;
