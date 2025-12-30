import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./modules/auth/auth.routes";
import treeRoutes from "./modules/tree/tree.routes";
import memberRoutes from "./modules/member/member.routes";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/trees", treeRoutes);
app.use("/", memberRoutes);

// Global error handler
app.use(errorMiddleware);
