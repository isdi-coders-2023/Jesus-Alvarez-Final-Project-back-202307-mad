import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User, UserLoginData } from '../entities/user';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media-files.js';
import { HttpError } from '../types/http-error.js';
import { TokenPayload } from '../types/token.js';
import { Controller } from './controller.js';

const debug = createDebug('PF11:Controller: UserController');

export class UserController extends Controller<User> {
  cloudinary: CloudinaryService;
  constructor(protected repo: Repository<User>) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as unknown as UserLoginData;
    const error = new HttpError(401, 'Unauthorized', 'Login Unauthorized');
    try {
      if (!this.repo.search) return;
      const data = await this.repo.search({ key: 'email', value: email });
      if (!data.length) {
        throw error;
      }

      const user = data[0];
      if (!(await Auth.comparePasswords(password, user.password))) {
        throw error;
      }

      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
      };

      const token = Auth.signJWT(payload);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hashPassword(req.body.password);
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for registration'
        );
      }

      const finalPath = req.file.destination + '/' + req.file!.filename;
      const imageData = await this.cloudinary.uploadImage(finalPath);
      req.body.imageData = imageData;
    } catch (error) {
      next(error);
    }

    super.create(req, res, next);
  }
}
