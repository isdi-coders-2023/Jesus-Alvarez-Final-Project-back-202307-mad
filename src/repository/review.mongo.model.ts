import { Schema, model } from 'mongoose';
import { Review } from '../entities/review';

const reviewSchema = new Schema<Review>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  courtId: {
    type: Schema.Types.ObjectId,
    ref: 'Court',
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  date: {
    type: Date,
  },
  image: {
    type: {
      id: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
    required: true,
  },
});

reviewSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const ReviewModel = model('Review', reviewSchema, 'reviews');
