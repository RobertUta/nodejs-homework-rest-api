const mongoose = require("mongoose");
require("dotenv").config();
const { app } = require("./app");

const PORT = 3000;
mongoose.set("strictQuery", true);

const connection = mongoose.connect(process.env.CONNECTION_STRING);
connection
  .then(() => {
    app.listen(PORT, function () {
      console.log("Database connection successful");
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
