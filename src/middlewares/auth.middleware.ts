import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

const ACCESS_SECRET = process.env.JWT_SECRET as string;

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Access Denied: No Token Provided" });

    const decoded = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
    req.user = decoded;

    // ============================================================
    // Rolling 30-day access token — re-issue on every request
    // ============================================================
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        phoneNo: decoded.phoneNo,
        userType: decoded.userType,
      },
      ACCESS_SECRET,
      { expiresIn: "30d" }
    );

    // Send the fresh token in a response header so the client can save it
    res.setHeader("x-new-access-token", newAccessToken);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
