import { Request, Response } from 'express';
import { ReviewMongoRepository } from '../repository/review.mongo.repository';

import { CloudinaryService } from '../services/media.files';

import { ReviewNoId } from '../entities/review';
import { CourtMongoRepository } from '../repository/court.mongo.repository';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { ReviewController } from './review.controller';

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const userMockRepo = new UserMongoRepository();
    const MockRepo = new CourtMongoRepository();

    test('Then, when we use create()', async () => {
      const mockRepo: ReviewMongoRepository = {
        create: jest.fn(),
      } as unknown as ReviewMongoRepository;

      // UserMockRepo: UserMongoRepository = {
      //   getById: jest
      //     .fn()
      //     .mockResolvedValueOnce({ id: '1' } as unknown as User),
      //   update: jest.fn().mockResolvedValueOnce({ id: '1' } as unknown as User),
      // } as unknown as UserMongoRepository;

      // courtMockRepo: CourtMongoRepository = {
      //   getById: jest
      //     .fn()
      //     .mockResolvedValueOnce({ id: '1' } as unknown as Court),
      //   update: jest
      //     .fn()
      //     .mockResolvedValueOnce({ id: '1' } as unknown as Court),
      // } as unknown as CourtMongoRepository;

      const reviewController = new ReviewController(mockRepo);

      const mockReview = {
        description: '',
        id: '1',
        userId: '',
        courtId: '',
      } as unknown as ReviewNoId;
      (mockRepo.create as jest.Mock).mockResolvedValueOnce(mockReview);

      const mockRequest = {
        body: {
          userId: '',
          courtId: '',
          image: { filename: '', destination: '' },
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.image);
      mockRepo.create = jest.fn().mockResolvedValueOnce({ id: '' });
      await reviewController.create(mockRequest, mockResponse, mockNext);
      // Await userMockRepo.getById('');
      // await courtMockRepo.getById('');

      expect(mockRepo.create).toHaveBeenCalled();

      expect(mockResponse.json).toHaveBeenCalled();
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
