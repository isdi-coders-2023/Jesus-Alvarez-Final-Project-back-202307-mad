import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http.error.js';
import { Auth } from './auth.js';

describe('Given the class Auth', () => {
  describe('When its methods are called', () => {
    test('When hashPassword() is called', () => {
      bcrypt.hash = jest.fn();
      Auth.hashPassword('');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
    test('When the comparePasswords is called', () => {
      bcrypt.compare = jest.fn();
      Auth.comparePasswords('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
    test('When the signJWT is called', () => {
      jwt.sign = jest.fn();
      const payload = { id: '', email: '' };
      Auth.signJWT(payload);
      expect(jwt.sign).toHaveBeenCalled();
    });
    test('When verifyJWTGettingPayload is called', () => {
      jwt.verify = jest.fn();
      Auth.verifyJWTGettingPayload('');
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('When verifyJWTGettingPayload is called and throws and Error', () => {
      jwt.verify = jest.fn().mockReturnValueOnce('');
      const error = new HttpError(498, 'Invalid Token');
      expect(() => Auth.verifyJWTGettingPayload('')).toThrowError(error);
    });
  });
});
