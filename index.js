require('dotenv').config();
const app = require('./app');
const connectDB = require('./database/db');

const port = process.env.PORT;
const url = process.env.SITE_URL;

connectDB().then(() => {
  app.listen(port, () => console.log(`Server started\nTest it out here: ${url}:${port}/docs`));
});
