import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

@Injectable()
export class imgMiddleware implements NestMiddleware {
  private readonly whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  upload = multer();

  use(req: Request, res: Response, next: NextFunction) {
    this.upload.single('file')(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file' });
      }
      if (req.file) {
        if (!this.whitelist.includes(req.file.mimetype)) {
          return res.status(403).json({ message: 'Please Upload a Valid IMG' });
        }

        next();
      } else {
        return res.status(403).json({ message: 'No file uploaded' });
      }
    });
  }
}
