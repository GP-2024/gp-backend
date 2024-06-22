import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

@Injectable()
export class BlogMiddleware implements NestMiddleware {
  private readonly whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  upload = multer({});

  use(req: Request, res: Response, next: NextFunction) {
    this.upload.array('files', 3)(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading files' });
      }

      if (req.files) {
        const files = req.files as Express.Multer.File[];

        if (files.length > 3) {
          return res.status(403).json({ message: 'Maximum 3 images are allowed' });
        }

        for (const file of files) {
          if (!this.whitelist.includes(file.mimetype)) {
            return res.status(403).json({ message: `Invalid image type: ${file.mimetype}` });
          }
        }

        (req as any).files = files;
      }
      next();
    });
  }
}
