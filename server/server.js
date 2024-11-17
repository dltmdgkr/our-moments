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
    origin: ["https://our-moments.p-e.kr", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
