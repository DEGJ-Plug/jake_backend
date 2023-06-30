const express = require("express");
const userRouter = require("./user/routes/user.route");

const app = express();

app.use(express.json());

app.get(["/" || "/home"], (_, res) => {
  res.status(200).json("Welcome to jake, the best e-commerce API");
});
app.use("/auth", userRouter);
app.use("*", (_, res) => {
  res.status(404).json("Not Found 😥😥😥");
});

module.exports = app;
