import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Review } from '../entities/review';
import { Repository } from '../repository/repository';
import { CloudinaryService } from '../services/media.files';
import { HttpError } from '../types/http.error';
import { Controller } from './controller';

const debug = createDebug('PF11:Controller: ReviewController');

export class ReviewController extends Controller<Review> {
  cloudinary: CloudinaryService;
  constructor(protected repo: Repository<Review>) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for registration'
        );
      }

      const finalPath = req.file.destination + '/' + req.file!.filename;
      const image = await this.cloudinary.uploadImage(finalPath);
      req.body.image = image;
    } catch (error) {
      next(error);
    }

    super.create(req, res, next);
  }
}
