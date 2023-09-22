import { ImageData } from '../types/image';
import { Review } from './review';

export type CourtNoId = {
  name: string;
  surface: string;
  location: string;
  pictures: ImageData;
  reviews: Review[];
};

export type CourtId = {
  id: string;
};

export type Court = CourtNoId & CourtId;
