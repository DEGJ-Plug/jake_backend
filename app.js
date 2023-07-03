const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const { authrouter, userprofile } = require('./user/routes/user.route');
const swaggerDocs = require('./utils/swagger');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * tags:
 *   name: Status
 * /:
 *   get:
 *     description: API Root or home page
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Failed / server not started
 */
app.get(['/', '/home'], (_, res) => {
  res.status(200).json('Welcome to jake, the best e-commerce API');
});
app.use('/auth', authrouter);
app.use('/user', userprofile);
app.use('*', (_, res) => {
  res.status(404).json('Not Found 😥😥😥');
});

module.exports = app;
