require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { authenticate } = require("./middleware/authentication");

const app = express();
const { MONGO_URI, PORT } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!!");

    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authenticate);
    app.use("/users", userRouter);
    app.use("/images", imageRouter);
    app.listen(PORT, () =>
      console.log("✅ Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => console.error(err));
