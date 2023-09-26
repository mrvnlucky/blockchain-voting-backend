require("dotenv").config({ path: ".env" });
const cors = require("cors");
const router = require("./routes/index");
const db = require("./models");

const port = process.env.PORT || 5050;

const express = require("express");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React frontend's domain
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

db.sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((error) => {
    console.log("Failed to sync db: " + error.message);
  });
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
