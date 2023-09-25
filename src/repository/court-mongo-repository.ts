import createDebug from 'debug';
import { Court } from '../entities/court.js';
import { HttpError } from '../types/http-error.js';
import { CourtModel } from './court-mongo-model.js';
import { Repository } from './repository.js';

const debug = createDebug('PF11:RepoCourtMongoRepository');

export class CourtMongoRepository implements Repository<Court> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Court[]> {
    const data = await CourtModel.find()
      .populate({
        path: 'reviews',
        populate: { path: 'userId' },
      })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Court> {
    const data = await CourtModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'Court not found in files system', {
        cause: 'Method findById',
      });
    return data;
  }

  async create(newData: Omit<Court, 'id'>): Promise<Court> {
    const newCourt = await CourtModel.create(newData);
    return newCourt;
  }

  async update(id: string, newData: FormData): Promise<Court> {
    const updatedCourt = await CourtModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!updatedCourt)
      throw new HttpError(404, 'Not Found', 'Court not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });

    return updatedCourt;
  }

  async delete(id: string): Promise<void> {
    const deleteCourt = await CourtModel.findByIdAndDelete(id).exec();
    if (!deleteCourt)
      throw new HttpError(404, 'Not Found', 'Court not found in file system', {
        cause: 'Fail to delete',
      });
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): Promise<Court[]> {
    const data = await CourtModel.find({ [key]: value }).exec();
    return data;
  }
}
