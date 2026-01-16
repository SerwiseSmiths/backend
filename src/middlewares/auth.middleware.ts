import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Auth Middleware Invoked");
  try {
    console.log("Auth Middleware Invoked");
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Authorization Header:", req.headers.authorization);

    if (!token)
      return res.status(401).json({ message: "Access Denied: No Token Provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
