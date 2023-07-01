const express = require('express');
const cookieParser = require('cookie-parser');
const { authrouter, userprofile } = require('./user/routes/user.route');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get(['/', '/home'], (_, res) => {
  res.status(200).json('Welcome to jake, the best e-commerce API');
});
app.use('/auth', authrouter);
app.use('/user', userprofile);
app.use('*', (_, res) => {
  res.status(404).json('Not Found 😥😥😥');
});

module.exports = app;
