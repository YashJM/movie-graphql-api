import { PrismaClient } from '@prisma/client';
import { decodeAuthHeader, AuthTokenPayload } from '../utils/auth';

export interface Context {
  prisma: PrismaClient;
  user: AuthTokenPayload | null;
}

const prisma = new PrismaClient();

export const createContext = async ({ req }: any): Promise<Context> => {
  const user = req && req.headers.authorization
    ? decodeAuthHeader(req.headers.authorization)
    : null;

  if (req.body.operationName === 'signup' ||
    req.body.operationName === 'login'
  ) {
    return {
      prisma,
      user: user
    };
  }

  return {
    prisma,
    user: user
  }
};
