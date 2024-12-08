import { verifyToken } from '../utils/auth';
import { AuthenticationError } from 'apollo-server-express';

export const authMiddleware = (context: any) => {
  const token = context.req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    throw new AuthenticationError('Authentication required');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return decoded;
};
