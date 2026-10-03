import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUserPayload } from '../types';

export class JwtUtil {
  static signToken(payload: AuthUserPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  static verifyToken(token: string): AuthUserPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
  }
}
