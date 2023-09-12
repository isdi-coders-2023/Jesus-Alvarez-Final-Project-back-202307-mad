import { Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { Auth } from '../services/auth';
import { UserController } from './user.controller';

describe('Given the class UserController', () => {
  describe('When it is instantiated', () => {
    const mockRepo: UserMongoRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
    };

    const userController = new UserController(mockRepo);

    test('Then when we use login()', async () => {
      const mockUser = {
        email: '',
        password: '',
      };
      const mockRequest = {
        params: { id: '1' },
        body: mockUser,
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      (mockRepo.search as jest.Mock).mockResolvedValueOnce([mockUser]);
      Auth.comparePasswords = jest.fn().mockReturnValueOnce(true);
      await userController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
    });
    test('Then, when login() throws an error when comparePass fails', async () => {
      const mockUser = {
        email: '',
        password: '',
      };
      const mockRequest = {
        params: { id: '1' },
        body: mockUser,
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      (mockRepo.search as jest.Mock).mockResolvedValueOnce([mockUser]);

      Auth.comparePasswords = jest.fn().mockResolvedValueOnce(false);

      await userController.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('Then, when we use create()', async () => {
      const mockUser = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        avatar: {
          id: '',
          width: 1,
          height: 1,
          format: '',
          url: '',
        },
        reviews: ['o'],
        role: '',
      };

      Auth.hashPassword = jest.fn();
      (mockRepo.create as jest.Mock).mockReturnValueOnce(mockUser);
      const mockRequest = {
        params: '1',
        body: {
          password: '12345',
        },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('When it is instantitated with errors', () => {
    test('Then, when login() throws an error', async () => {
      const mockRepo: UserMongoRepository = {
        search: jest.fn().mockResolvedValue([]),
      } as unknown as UserMongoRepository;
      const userController = new UserController(mockRepo);
      const mockRequest = {
        params: '1',
        body: { email: '', password: '' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.login(mockRequest, mockResponse, mockNext);
      const thrownError = mockNext.mock.calls[0][0];
      expect(thrownError.message).toBe('Login Unauthorized');
    });

    test('Then, when create() throws an error', async () => {
      const mockRepo: UserMongoRepository = {
        create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      } as unknown as UserMongoRepository;

      const userController = new UserController(mockRepo);
      const mockRequest = {
        body: {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          avatar: {
            id: '',
            width: 1,
            height: 1,
            format: '',
            url: '',
          },
          reviews: ['o'],
          role: '',
        },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();
      await userController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
  });
});
