require("dotenv").config();
const app = require("./app");
const connectDB = require("./database/db");

const port = process.env.PORT;

connectDB().then(() => {
  app.listen(port, () => console.log(`Server listening on ${port}`));
});
