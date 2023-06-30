const { Router } = require("express");
const userValidation = require("../middlewares/user.validate");
const { userSignUp, verifyUser } = require("../controllers/user.controller");

const router = Router();

router.get("/verify", verifyUser);
router.post("/signup", userValidation, userSignUp);

module.exports = router;
