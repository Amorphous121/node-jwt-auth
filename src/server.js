require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");

require("./utils/init-redis");
const AuthRoutes = require("./Routes/auth.route");
const { connectMongo } = require("./utils/connectMongo");

const app = express();
const port = parseInt(process.env.PORT || 4000, 10);

app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", AuthRoutes);

app.use((req, res, next) => next(createError.NotFound()));

app.use((error, req, res, next) => {
  const { status = 500, message = "Something wen't wrong" } = error;
  return res.status(status).json({ status, message });
});

connectMongo().then(() => {
  app.listen(port, () => console.log(`🚀 Server is up and running at ${port}`));
});
