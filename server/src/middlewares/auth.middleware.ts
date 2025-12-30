import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err: any = new Error("Not authenticated");
    err.statusCode = 401;
    err.code = "NOT_AUTHENTICATED";
    return next(err);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch {
    const err: any = new Error("Invalid token");
    err.statusCode = 401;
    err.code = "INVALID_TOKEN";
    next(err);
  }
};
