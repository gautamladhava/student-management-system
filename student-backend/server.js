require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const sequelize = require("./db");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Make sure this is before routes
app.use(express.urlencoded({ extended: true })); // Add this line

// Use the main router
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.sync(); //{ force: true } to reset DB
    console.log("Database synced");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error(err);
  }
}

start();
