import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { db } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";

export interface AuthRequest extends Request {
  userId?: string;
  clerkUserId?: string;
  workspaceId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Missing authorization header", 401, "UNAUTHORIZED");
    }

    const token = authHeader.substring(7);
    const { sub: clerkUserId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!clerkUserId) {
      throw new AppError("Invalid token", 401, "UNAUTHORIZED");
    }

    const user = await db.user.findUnique({ where: { clerkId: clerkUserId } });
    if (!user) {
      throw new AppError("User not found", 401, "UNAUTHORIZED");
    }

    req.userId = user.id;
    req.clerkUserId = clerkUserId;

    const workspace = await db.workspace.findUnique({
      where: { ownerId: user.id },
    });
    if (workspace) {
      req.workspaceId = workspace.id;
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.code });
      return;
    }
    res.status(401).json({ error: "UNAUTHORIZED" });
  }
}
