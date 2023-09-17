import createDebug from 'debug';
import { Repository } from './repository';

import { Review } from '../entities/review';
import { HttpError } from '../types/http.error';
import { ReviewModel } from './review.mongo.model';

const debug = createDebug('PF11:RepoReviewMongoRepository');

export class ReviewMongoRepository implements Repository<Review> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Review[]> {
    const data = await ReviewModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<Review> {
    const data = await ReviewModel.findById(id).exec();
    if (!data)
      throw new HttpError(
        404,
        'Not found',
        'Review not found in files system',
        {
          cause: 'Method findById',
        }
      );
    return data;
  }

  async create(newData: Omit<Review, 'id'>): Promise<Review> {
    const newReview = await ReviewModel.create(newData);
    return newReview;
  }

  async update(id: string, newData: Partial<Review>): Promise<Review> {
    const updatedReview = await ReviewModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!updatedReview)
      throw new HttpError(404, 'Not Found', 'Review not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });

    return updatedReview;
  }

  async delete(id: string): Promise<void> {
    const deletedReview = await ReviewModel.findByIdAndDelete(id).exec();

    if (!deletedReview)
      throw new HttpError(404, 'Not Found', 'Review not found in file system', {
        cause: 'Fail to delete',
      });
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): Promise<Review[]> {
    const data = await ReviewModel.find({ [key]: value }).exec();
    return data;
  }
}