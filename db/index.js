const mongoose = require("mongoose");
require("./model/product.model");
require("./model/user.model");

const { DB_URI, DB_PASSWORD, DB_USERNAME, DB_NAME } = process.env;

let db_uri = DB_URI;
db_uri = db_uri
  .replace(/\<username\>/g, encodeURIComponent(DB_USERNAME))
  .replace(/\<password\>/g, encodeURIComponent(DB_PASSWORD))
  .replace(/\<dbname\>/g, encodeURIComponent(DB_NAME));

module.exports = (cb) => {
  mongoose.connect(
    db_uri,
    {
      useUnifiedTopology: true,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Mongo DB connection successful!");
      // console.log({ result });
      cb();
    }
  );
};
