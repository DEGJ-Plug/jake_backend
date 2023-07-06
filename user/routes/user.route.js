const { Router } = require("express");
const userValidation = require("../middlewares/user.validate");
const validToken = require("../middlewares/tokenCookie");
const upload = require("../../utils/multer");
const {
  userSignUp,
  verifyUser,
  userLogin,
  profile,
  resetToken,
  resetPassword,
} = require("../controllers/user.controller");
const updateProfile = require("../controllers/profile.controller");

const authrouter = Router();
const userprofile = Router();

authrouter.get("/verify", verifyUser);
authrouter.post("/signup", userValidation, userSignUp);
authrouter.post("/login", userLogin);
authrouter.post("/reset-token", resetToken);
// for frontend takes the token from the url & passes it as authorization header
// authrouter.get('/reset-password/:token');
authrouter.post("/reset-password", validToken, resetPassword);

userprofile.get("/", validToken, profile);
userprofile.get(
  "/update-profile",
  validToken,
  upload.single("image"),
  updateProfile
);
module.exports = { authrouter, userprofile };
