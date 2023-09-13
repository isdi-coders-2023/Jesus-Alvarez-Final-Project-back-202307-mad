import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
const debug = createDebug('PF11:Router: UserRouter');
debug('Loaded');

const repo = new UserMongoRepository();
const userController = new UserController(repo);
export const userRouter = createRouter();

userRouter.patch('/login', userController.login.bind(userController));
userRouter.post('/register', userController.create.bind(userController));
