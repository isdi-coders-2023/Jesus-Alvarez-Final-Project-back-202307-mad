import { Request, Response } from 'express';
import { ReviewNoId } from '../entities/review';
import { CourtMongoRepository } from '../repository/court-mongo-repository';
import { ReviewMongoRepository } from '../repository/review-mongo-repository';
import { UserMongoRepository } from '../repository/user-mongo-repository';
import { CloudinaryService } from '../services/media-files';
import { ReviewController } from './review-controller';

jest.mock('../repository/court.mongo.repository');
jest.mock('../repository/user.mongo.repository');
jest.mock('../repository/review.mongo.repository');

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const userMockRepo = new UserMongoRepository();
    const courtMockRepo = new CourtMongoRepository();

    const mockRepo: ReviewMongoRepository = {
      create: jest.fn().mockResolvedValue({}),
    } as unknown as ReviewMongoRepository;

    const reviewController = new ReviewController(mockRepo);

    test('Then, when we use create()', async () => {
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

      userMockRepo.getById = jest.fn().mockResolvedValue({});
      courtMockRepo.getById = jest.fn().mockResolvedValue({});
      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.image);

      const mockReview = {
        description: '',
        id: '1',
        userId: '',
        courtId: '',
      } as unknown as ReviewNoId;

      (mockRepo.create as jest.Mock).mockResolvedValueOnce(mockReview);

      await reviewController.create(mockRequest, mockResponse, mockNext);

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
