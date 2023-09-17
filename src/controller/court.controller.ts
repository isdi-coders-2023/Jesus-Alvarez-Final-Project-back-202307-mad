import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Court } from '../entities/court.js';
import { Repository } from '../repository/repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/http.error.js';
import { Controller } from './controller.js';

const debug = createDebug('PF11:Controller: CourtController');

export class CourtController extends Controller<Court> {
  cloudinary: CloudinaryService;
  constructor(protected repo: Repository<Court>) {
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
      const pictures = await this.cloudinary.uploadImage(finalPath);
      req.body.pictures = pictures;
    } catch (error) {
      next(error);
    }

    super.create(req, res, next);
  }
}
