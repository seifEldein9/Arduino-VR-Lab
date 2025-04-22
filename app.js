import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import googleAuthRouter from "./routes/googleAuth.js";
import Contact from "./routes/Contact.js";
import chatRouter from "./routes/Message.js";
import Product from "./routes/Product.js";
import productrequest from "./routes/productrequest.js";

import authRouter from "./routes/auth.js";
const app = express();

dotenv.config({ path: ".env" });

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "http://localhost:3000"
    : "http://localhost:3000";
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", googleAuthRouter);
app.use("/auth", authRouter);

app.use("/chat", chatRouter);

app.use("/Product", Product);
app.use("/productrequest", productrequest);

app.use("/Contact", Contact);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log(err);
  });
