import { ImageData } from '../types/image.js';

export type UserLoginData = {
  email: string;
  password: string;
};

export type UserNoId = UserLoginData & {
  firstName: string;
  lastName: string;
  avatar: ImageData;
  reviews: [];
  role: string;
};

export type UserWithId = {
  id: string;
};

export type User = UserNoId & UserWithId;