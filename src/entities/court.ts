import { ImageData } from '../types/image';

export type CourtNoId = {
  surface: string;
  location: string;
  pictures: ImageData;
  reviews: string[];
};

export type CourtId = {
  id: string;
};

export type Court = CourtNoId & CourtId;
