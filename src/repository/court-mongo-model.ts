import { Schema, model } from 'mongoose';
import { Court } from '../entities/court';

const courtSchema = new Schema<Court>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  surface: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pictures: {
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
});

courtSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const CourtModel = model('Court', courtSchema, 'courts');
