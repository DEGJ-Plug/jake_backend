const { Router } = require('express');
const userValidation = require('../middlewares/user.validate');
const validToken = require('../middlewares/tokenCookie');
const {
  userSignUp, verifyUser, userLogin, profile,
} = require('../controllers/user.controller');

const authrouter = Router();
const userprofile = Router();

authrouter.get('/verify', verifyUser);
authrouter.post('/signup', userValidation, userSignUp);
authrouter.post('/login', userLogin);
userprofile.get('/', validToken, profile);
module.exports = { authrouter, userprofile };
