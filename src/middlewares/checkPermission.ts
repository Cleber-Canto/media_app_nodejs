import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const checkPermission = (_requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("No token provided");
      return res.status(403).json({ message: 'No token provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      const userId = decoded.id;
      const userRole = decoded.role;

      console.log("Decoded token:", decoded);
      console.log("User ID from token:", userId);

      // if (!requiredRoles.includes(userRole)) {
      //   return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      // }

      req.userId = userId; // Adiciona o userId ao objeto de requisição
      next();
    } catch (error) {
      console.log("Failed to authenticate token:", error);
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
  };
};
