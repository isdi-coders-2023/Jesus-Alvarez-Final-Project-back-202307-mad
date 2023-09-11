import createDebug from 'debug';
import { User } from '../entities/user.js';
import { Repository } from './repository.js';
import { UserModel } from './user.mongo.model.js';

const debug = createDebug('PF11:RepoUserMongoRepository');

export class UserMongoRepository implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find().exec();
    return data;
  }
}
