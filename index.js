require("dotenv").config();
const initDB = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const app = express();
const { PORT } = process.env;

initDB(() => {
  // parse application/json body data
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // middlewares
  app.get("/", [
    (req, res, next) => {
      console.log(`Time: ${new Date()?.toLocaleString()}`);
      console.log("Middleware 1");

      next("route");
    },
    (req, res, next) => {
      console.log("Middleware 2");
      next();
    },
  ]);
  // Setup routes
  app.use("/product", productRoute);
  app.use("/auth", authRoute)
  // Error handler
  app.use((error, req, res, next) => {
    res.json({
      data: null,
      status: false,
      error: error?.message,
    });
  });
  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
});
