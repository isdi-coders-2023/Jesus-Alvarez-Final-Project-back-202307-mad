import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { CourtController } from '../controller/court.controller.js';
import { FilesInterceptor } from '../middleware/files-interceptor.js';
import { CourtMongoRepository } from '../repository/court-mongo-repository.js';

const debug = createDebug('PF11:Router: UserRouter');

const repo = new CourtMongoRepository();
const courtController = new CourtController(repo);
export const courtRouter = createRouter();
const files = new FilesInterceptor();

courtRouter.post(
  '/register',
  files.singleFileStore('pictures').bind(files.singleFileStore),
  courtController.create.bind(courtController),
  (req, res, _Next) => {
    debug('final', req.body);
    debug(req.file);
    res.json(req.body);
  }
);
courtRouter.get('/', courtController.getAll.bind(courtController));
courtRouter.get('/:id', courtController.getById.bind(courtController));
courtRouter.delete('/:id', courtController.delete.bind(courtController));
