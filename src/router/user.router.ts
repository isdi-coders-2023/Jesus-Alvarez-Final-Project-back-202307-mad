import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
const debug = createDebug('PF11:Router: UserRouter');
debug('Loaded');

const repo = new UserMongoRepository();
const userController = new UserController(repo);
export const userRouter = createRouter();
const files = new FilesInterceptor();

userRouter.patch('/login', userController.login.bind(userController));
userRouter.post(
  '/register',
  files.singleFileStore('imageData').bind(files.singleFileStore),
  userController.create.bind(userController),
  (req, res, _Next) => {
    res.json(req.body);
  }
);

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.getById.bind(userController));
userRouter.delete('/:id', userController.delete.bind(userController));
