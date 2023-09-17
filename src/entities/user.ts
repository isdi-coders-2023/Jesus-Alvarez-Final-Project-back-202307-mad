import joi from 'joi';
import { ImageData } from '../types/image.js';
import { Review } from './review.js';

export type UserLoginData = {
  email: string;
  password: string;
};

export type UserNoId = UserLoginData & {
  firstName: string;
  lastName: string;
  imageData: ImageData;
  reviews: Review[];
  role: 'user' | 'admin';
};

export type UserWithId = {
  id: string;
};

export type User = UserNoId & UserWithId;

export const userSchema = joi.object<User>({
  email: joi.string().email().required().messages({
    'string.email': `Se necesita un correo válido`,
    'string.empty': `Se necesita un correo válido`,
  }),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});
