import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const debug = createDebug('PF11:Middleware:Files.Interceptor');

export class FilesInterceptor {
  constructor() {
    debug('Instantiated');
  }

  singleFileStore(fileName: string) {
    debug('Multer Call');

    const storage = multer.diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        callback(null, file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fileName);

    return (req: Request, res: Response, next: NextFunction) => {
      const prevBody = req.body;
      middleware(req, res, next);
      req.body = { ...prevBody, ...req.body };
    };
  }
}
