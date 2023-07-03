const { Router } = require('express');
const userValidation = require('../middlewares/user.validate');
const validToken = require('../middlewares/tokenCookie');
const {
  userSignUp, verifyUser, userLogin, profile, resetToken, resetPassword,
} = require('../controllers/user.controller');

const authrouter = Router();
const userprofile = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - userName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         userName:
 *           type: string
 *           description: The user's unique alias
 *         email:
 *           type: string
 *           description: The user's email address
 *         role:
 *           type: ['buyer','seller','logistics']
 *           default: 'buyer'
 *           description: Type of user
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Status of email verification
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user registered
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user profile was last updated
 *       example:
 *         userName: "smartkid"
 *         email: "sure@yopmail.com"
 *         password: "wahala_nodey_finish"
 *         role: "seller"
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication Endpoints
 * /auth/signup:
 *   post:
 *     description: Creates a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Failed; conditions not met
 *       500:
 *         description: Internal server error
 */
authrouter.post('/signup', userValidation, userSignUp);
authrouter.get('/verify', verifyUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Logs into a user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           {emailUserName,
 *           password}
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Failed; conditions not met
 *       500:
 *         description: Internal server error
 */
authrouter.post('/login', userLogin);
authrouter.post('/reset-token', resetToken);
// for frontend takes the token from the url & passes it as authorization header
// authrouter.get('/reset-password/:token');
authrouter.post('/reset-password', validToken, resetPassword);

userprofile.get('/', validToken, profile);
module.exports = { authrouter, userprofile };
