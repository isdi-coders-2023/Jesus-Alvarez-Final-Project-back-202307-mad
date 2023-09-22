import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http-error.js';
import { TokenPayload } from '../types/token.js';

export class Auth {
  static secret = process.env.TOKEN_SECRET!;

  static hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static signJWT(payload: TokenPayload): string {
    const token = jwt.sign(payload, Auth.secret);
    return token;
  }

  static verifyJWTGettingPayload(token: string): TokenPayload {
    try {
      const result = jwt.verify(token, Auth.secret);
      if (typeof result === 'string') {
        throw new HttpError(498, 'Invalid Token', result);
      }

      return result as TokenPayload;
    } catch {
      throw new HttpError(498, 'Invalid Token');
    }
  }
}
