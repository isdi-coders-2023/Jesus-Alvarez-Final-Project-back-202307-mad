import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 40,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  imageData: {
    type: {
      id: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
