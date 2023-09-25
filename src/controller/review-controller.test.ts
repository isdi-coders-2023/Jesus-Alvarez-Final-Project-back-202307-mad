import { Request, Response } from 'express';
import { Court } from '../entities/court';
import { Review } from '../entities/review';
import { User } from '../entities/user';
import { CourtMongoRepository } from '../repository/court-mongo-repository';
import { ReviewMongoRepository } from '../repository/review-mongo-repository';
import { UserMongoRepository } from '../repository/user-mongo-repository';
import { CloudinaryService } from '../services/media-files';
import { ReviewController } from './review-controller';

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const userMock = { reviews: [] } as unknown as User;
    const courtMock = { reviews: [] } as unknown as Court;
    UserMongoRepository.prototype.getById = jest.fn().mockReturnValue(userMock);
    UserMongoRepository.prototype.update = jest.fn().mockReturnValue(userMock);
    CourtMongoRepository.prototype.update = jest.fn().mockReturnValue(userMock);
    CourtMongoRepository.prototype.getById = jest
      .fn()
      .mockReturnValue(courtMock);

    const mockReview = {
      description: '',
      id: '1',
      userId: '',
      courtId: '',
      image: {},
    } as unknown as Review;

    const mockRepo: ReviewMongoRepository = {
      create: jest.fn().mockResolvedValue(mockReview),
      getById: jest.fn().mockResolvedValue({}),
    } as unknown as ReviewMongoRepository;

    const reviewController = new ReviewController(mockRepo);

    test('Then, when we use create()', async () => {
      const mockRequest = {
        file: {},
        body: {
          userId: '1',
          courtId: '1',
          image: {},
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockReview),
        status: jest.fn().mockResolvedValue(201),
      } as unknown as Response;

      const mockNext = jest.fn();

      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.image);

      await reviewController.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(UserMongoRepository.prototype.update).toHaveBeenCalled();
    });
    test('Then when theres an error in the create()', async () => {
      const mockRequest = {
        file: null,
        body: {
          userId: '1',
          courtId: '1',
          image: {},
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockReview),
        status: jest.fn().mockResolvedValue(201),
      } as unknown as Response;

      const mockNext = jest.fn();
      await reviewController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const mockReviewRepo: ReviewMongoRepository = {
      getById: jest
        .fn()
        .mockResolvedValue({ userId: { id: '' }, courtId: { id: '' } }),
      delete: jest.fn().mockResolvedValue({}),
    } as unknown as ReviewMongoRepository;

    const reviewController2 = new ReviewController(mockReviewRepo);
    UserMongoRepository.prototype.getById = jest
      .fn()
      .mockReturnValue({ reviews: [] });
    CourtMongoRepository.prototype.getById = jest
      .fn()
      .mockReturnValue({ reviews: [] });
    test('Then, when we call the method delete()', async () => {
      const mockRequest = { params: { id: '' } } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockResolvedValue(204),
      } as unknown as Response;
      const mockNext = jest.fn();
      await reviewController2.delete(mockRequest, mockResponse, mockNext);
      expect(mockReviewRepo.delete).toHaveBeenCalled();
    });
    test('Then, when we have an error while calling the method delete()', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockResolvedValue(204),
      } as unknown as Response;
      const mockNext = jest.fn();
      await reviewController2.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('Given the class ReviewController', () => {
  describe('When it is instantiated', () => {
    const mockReview = {} as unknown as Review;
    const mockRepo: ReviewMongoRepository = {
      update: jest.fn().mockResolvedValue(mockReview),
    } as unknown as ReviewMongoRepository;
    const reviewController = new ReviewController(mockRepo);
    test('When we call the method update()', async () => {
      const mockRequest = {
        body: { image: {} },
        file: '',
        params: '',
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockReview),
        status: jest.fn().mockResolvedValue(200),
      } as unknown as Response;
      const mockNext = jest.fn();
      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockRequest.body.image);
      await reviewController.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('When we call it and theres an error', async () => {
      const mockRequest = {
        body: { image: {} },

        params: '',
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockReview),
        status: jest.fn().mockResolvedValue(200),
      } as unknown as Response;
      const mockNext = jest.fn();
      await reviewController.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
