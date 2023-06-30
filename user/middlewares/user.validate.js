const userValidation = (req, res, next) => {
  let { userName, email, password } = req.body;
  userName = userName.toLowerCase();
  email = email.toLowerCase();

  if (!userName || typeof userName !== "string")
    return res
      .status(400)
      .json({ message: "user name is required and must be a string" });
  if (!email || typeof email !== "string")
    return res
      .status(400)
      .json({ message: "email is required and must be a string" });
  if (!password || typeof password !== "string" || password.length < 5)
    return res
      .status(400)
      .json({ message: "password is required and must be a string" });

  next();
};

module.exports = userValidation;
