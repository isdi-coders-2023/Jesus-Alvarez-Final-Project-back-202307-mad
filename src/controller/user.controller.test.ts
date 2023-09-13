import { Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { Auth } from '../services/auth';
import { CloudinaryService } from '../services/media.files';
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
      Auth.signJWT = jest.fn().mockReturnValueOnce('');

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
    test('Then, when we use getAll()', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then, when we call the getById()', async () => {
      const mockRequest = {
        params: { id: '01' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then, when we call the delete() method', async () => {
      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
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
      await userController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
    test('Then, when we use update()', async () => {
      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe('When it is instantitated with errors', () => {
    const mockRepo: UserMongoRepository = {
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      search: jest.fn().mockRejectedValueOnce(new Error('Search Error')),
      update: jest.fn().mockRejectedValueOnce(new Error('Update Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
    } as unknown as UserMongoRepository;
    const userController = new UserController(mockRepo);
    test('Then, when getAll throws an error', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toBeCalledWith();
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then, when getById() throws an error', async () => {
      const mockRequest = {
        params: { id: '01' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.getById(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then, when delete() throws an error', async () => {
      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
    });
    test('Then, when create() throws an error', async () => {
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
    test('Then, when update() throws an error', async () => {
      const mockRequest = {
        params: { id: 'someUserId' },
        body: {
          userName: 'Kubo',
        },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.update(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
    });
  });
});

describe('Given the class UserController', () => {
  describe('When theres an error calling the search method during the login', () => {
    test('Then, there should be an error throwed', async () => {
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
  });
});
