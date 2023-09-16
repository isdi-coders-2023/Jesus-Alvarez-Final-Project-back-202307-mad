import { Request, Response } from 'express';
import { Auth } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';

describe('Given the class AuthInterceptor', () => {
  const authInterceptor = new AuthInterceptor();
  const mockeResponse = {} as unknown as Response;
  const mockNext = jest.fn();
  describe('When it is instantiated and...', () => {
    test('Then, when the method authorization() is called', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer soy_el_token'),
        body: {},
      } as unknown as Request;
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValueOnce({ id: '1' });
      authInterceptor.authoritzation(mockRequest, mockeResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe('When it is intantiated and there are errors', () => {
    test('When there is not authorization', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(null),
        body: {},
      } as unknown as Request;
      authInterceptor.authoritzation(mockRequest, mockeResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
