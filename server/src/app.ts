import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler
app.use(errorMiddleware);
