import { Request, Response } from 'express';
import { CourtMongoRepository } from '../repository/court.mongo.repository';

import { CloudinaryService } from '../services/media.files';
import { CourtController } from './court.controller';

describe('Given the class CourtController', () => {
  describe('When it is instantiated', () => {
    const mockRepo: CourtMongoRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
    };

    const courtController = new CourtController(mockRepo);

    test('Then, when we use create()', async () => {
      const mockCourt = {
        email: '',
      };

      (mockRepo.create as jest.Mock).mockReturnValueOnce(mockCourt);

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
      await courtController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockCourt);
    });
  });
  describe('When it is instantitated with errors', () => {
    const mockRepo: CourtMongoRepository = {
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      search: jest.fn().mockRejectedValueOnce(new Error('Search Error')),
      update: jest.fn().mockRejectedValueOnce(new Error('Update Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
    } as unknown as CourtMongoRepository;
    const courtController = new CourtController(mockRepo);

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
      await courtController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
  });
});
