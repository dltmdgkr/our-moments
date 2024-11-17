require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { authenticate } = require("./middleware/authentication");

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!!");

    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authenticate);
    app.get("/", (req, res) => {
      res.send("Express 서버가 정상적으로 작동 중입니다!");
    });
    app.use("/users", userRouter);
    app.use("/images", imageRouter);
    app.listen(PORT, () =>
      console.log("✅ Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => console.error(err));
