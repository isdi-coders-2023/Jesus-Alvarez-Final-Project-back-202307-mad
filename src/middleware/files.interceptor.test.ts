/* eslint-disable max-nested-callbacks */
import { Request, Response } from 'express';
import multer from 'multer';
import { FilesInterceptor } from './files.interceptor';

jest.mock('multer');

describe('Given the class FilesInterceptor', () => {
  describe('When it is instantiated', () => {
    const interceptor = new FilesInterceptor();
    test('Then, when we use the method singleFileStore()', () => {
      const mockMiddleware = jest.fn();

      multer.diskStorage = jest
        .fn()
        .mockImplementationOnce(({ filename }) => filename('', '', () => {}));

      (multer as unknown as jest.Mock).mockReturnValue({
        single: jest.fn().mockReturnValue(mockMiddleware),
      });

      const mockRequest = {} as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();
      interceptor.singleFileStore('')(mockRequest, mockResponse, mockNext);

      expect(mockMiddleware).toHaveBeenCalled();
    });
  });
});
