import { verifyToken } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
  clerkId?: string;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
      issuer: (iss) => iss.startsWith("https://clerk.") || iss.includes(".clerk.accounts.dev"),
    });

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Extract user info from token
    req.clerkId = payload.sub;
    req.userId = payload.sub; // For now, using clerkId as userId
    req.userRole = (payload as any).publicMetadata?.role as string || "CUSTOMER";

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

export const requireDealer = requireRole(["DEALER", "ADMIN"]);
export const requireAdmin = requireRole(["ADMIN"]);
export const requireCustomer = requireRole(["CUSTOMER", "DEALER", "ADMIN"]);
