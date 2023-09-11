import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

export const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.write('<h1>Bienvenidos al servidor de Tennis Zone!</h1>');
  res.end();
});
