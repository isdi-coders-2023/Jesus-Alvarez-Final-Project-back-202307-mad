import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { ReviewController } from '../controller/review-controller.js';
import { FilesInterceptor } from '../middleware/files-interceptor.js';
import { ReviewMongoRepository } from '../repository/review-mongo-repository.js';
const debug = createDebug('PF11:Router: ReviewRouter');
debug('Loaded');

const repo = new ReviewMongoRepository();
const reviewController = new ReviewController(repo);
export const reviewRouter = createRouter();
const files = new FilesInterceptor();

reviewRouter.post(
  '/register',
  files.singleFileStore('image').bind(files.singleFileStore),
  reviewController.create.bind(reviewController),
  (req, res, _Next) => {
    res.json(req.body);
  }
);

reviewRouter.get('/', reviewController.getAll.bind(reviewController));
reviewRouter.get('/:id', reviewController.getById.bind(reviewController));
reviewRouter.delete('/:id', reviewController.delete.bind(reviewController));
reviewRouter.patch(
  '/:id',
  files.singleFileStore('image').bind(files.singleFileStore),
  reviewController.update.bind(reviewController)
);
