import { Court } from './court';
import { User } from './user';

export type ReviewNoId = {
  userId: User['id'];
  courtId: Court['id'];
  description: string;
  date: Date;
  image: ImageData;
};

export type ReviewId = {
  id: string;
};

export type Review = ReviewNoId & ReviewId;
