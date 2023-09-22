import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Review } from '../entities/review.js';
import { CourtMongoRepository } from '../repository/court-mongo-repository.js';
import { Repository } from '../repository/repository.js';
import { UserMongoRepository } from '../repository/user-mongo-repository.js';
import { CloudinaryService } from '../services/media-files.js';
import { HttpError } from '../types/http-error.js';
import { Controller } from './controller.js';

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

      const userRepo = new UserMongoRepository();
      const courtRepo = new CourtMongoRepository();
      const user = await userRepo.getById(req.body.userId);
      const court = await courtRepo.getById(req.body.courtId);
      const finalPath = req.file.destination + '/' + req.file!.filename;
      const image = await this.cloudinary.uploadImage(finalPath);
      req.body.image = image;

      const finalReview = await this.repo.create(req.body);

      user.reviews.push(finalReview);
      court.reviews.push(finalReview);

      userRepo.update(user.id, user);
      courtRepo.update(court.id, court);
      res.status(201);
      res.json(finalReview);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await this.repo.getById(req.params.id);

      const userid = review.userId.id;
      const userRepo = new UserMongoRepository();
      const user = await userRepo.getById(userid);
      const newUserArray = user.reviews.filter(
        (review) => String(review) !== req.params.id
      );
      user.reviews = newUserArray;

      const courtid = review.courtId.id;
      const courtRepo = new CourtMongoRepository();

      const court = await courtRepo.getById(courtid);

      const newCourtArray = court.reviews.filter(
        (review) => String(review) !== req.params.id
      );

      court.reviews = newCourtArray;

      await this.repo.delete(req.params.id);

      userRepo.update(user.id, user);
      courtRepo.update(court.id, court);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
