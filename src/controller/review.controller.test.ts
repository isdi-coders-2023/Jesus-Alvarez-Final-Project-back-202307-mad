import { Request, Response } from 'express';
import { ReviewMongoRepository } from '../repository/review.mongo.repository';

import { CloudinaryService } from '../services/media.files';

import { ReviewController } from './review.controller';

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const mockRepo: ReviewMongoRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
    };

    const reviewController = new ReviewController(mockRepo);

    test('Then, when we use create()', async () => {
      const mockReview = {
        email: '',
      };

      (mockRepo.create as jest.Mock).mockReturnValueOnce(mockReview);

      const mockRequest = {
        params: '1',
        body: {
          password: '12345',
          imageData: '',
        },
        file: { filename: '', destination: '' },
      } as unknown as Request;

      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.imageData);

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();
      await reviewController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockReview);
    });
  });
  describe('When it is instantitated with errors', () => {
    const mockRepo: ReviewMongoRepository = {
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      search: jest.fn().mockRejectedValueOnce(new Error('Search Error')),
      update: jest.fn().mockRejectedValueOnce(new Error('Update Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
    } as unknown as ReviewMongoRepository;
    const reviewController = new ReviewController(mockRepo);

    test('Then, when create() throws an error', async () => {
      const mockRequest = {
        body: {
          email: '',
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();
      await reviewController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
  });
});
