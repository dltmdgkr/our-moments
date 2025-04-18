require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRouter");
const { authenticate } = require("./middleware/authentication");
const { postRouter } = require("./routes/postRouter");

const app = express();
const { MONGO_URI, PORT } = process.env;

if (!MONGO_URI || !PORT) {
  console.error("❌ Missing required environment variables: MONGO_URI or PORT");
  process.exit(1);
}

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://our-moments.p-e.kr",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
app.options("*", cors(corsOptions));

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
  app.use("/images", postRouter);
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
