require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { authenticate } = require("./middleware/authentication");

const app = express();
const { MONGO_URI, PORT } = process.env;

if (!MONGO_URI || !PORT) {
  console.error("❌ Missing required environment variables: MONGO_URI or PORT");
  process.exit(1);
}

const allowedOrigins = ["https://our-moments.p-e.kr", "http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "sessionid",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(204).send();
  } else {
    res
      .status(403)
      .send({ message: "CORS policy does not allow this origin." });
  }
});

function setupMiddleware(app) {
  app.use("/uploads", express.static("uploads"));
  app.use(express.json());
  app.use(authenticate);
}

function setupRoutes(app) {
  app.get("/", (req, res) => {
    res.send("Express 서버가 정상적으로 작동 중입니다!");
  });
  app.use("/users", userRouter);
  app.use("/images", imageRouter);
}

function setupErrorHandling(app) {
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  });
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected!!");

    setupMiddleware(app);
    setupRoutes(app);
    setupErrorHandling(app);

    app.listen(PORT, () => {
      console.log(`✅ Express server listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();
