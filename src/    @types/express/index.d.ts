import { Request } from 'express';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      files?: {
        [fieldname: string]: Express.Multer.File[];
      };
      params: {
        id: string;
      };
    }
  }
}
