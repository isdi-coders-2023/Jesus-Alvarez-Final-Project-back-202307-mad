import createDebug from 'debug';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http-error.js';
import { Repository } from './repository.js';
import { UserModel } from './user-mongo-model.js';

const debug = createDebug('PF11:RepoUserMongoRepository');

export class UserMongoRepository implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not found', 'User not found in files system', {
        cause: 'Method findById',
      });
    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const newUser = await UserModel.create(newData);
    return newUser;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!updatedUser)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    debug(id);
    const deletedUser = await UserModel.findByIdAndDelete(id).exec();

    if (!deletedUser)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Fail to delete',
      });
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): Promise<User[]> {
    const data = await UserModel.find({ [key]: value }).exec();
    return data;
  }
}
