const express = require('express');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authrouter, userprofile } = require('./user/routes/user.route');
const productRouter = require('./product/routes/product.route');
const { requestReceived } = require('./utils/requestLogger');
const swaggerDocument = require('./docs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(requestReceived({ logger: console.log }));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get(['/', '/home'], (_, res) => {
  res.status(200).json('Welcome to jake, the best e-commerce API');
});
app.use('/auth', authrouter);
app.use('/user', userprofile);
app.use('/product', productRouter);
app.use('*', (_, res) => {
  res.status(404).json('Not Found 😥😥😥');
});

module.exports = app;
