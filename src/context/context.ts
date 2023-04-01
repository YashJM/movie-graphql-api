import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { decodeAuthHeader, AuthTokenPayload } from '../utils/auth';

export interface Context {
  prisma: PrismaClient;
  user?: AuthTokenPayload | null;
}

const prisma = new PrismaClient();

export const createContext = async ({ req }: any): Promise<Context> => {
  let user: AuthTokenPayload | null = null;

  if (req && req.headers.authorization && req.body.operationName !== 'IntrospectionQuery') {
    try {
      user = decodeAuthHeader(req.headers.authorization);
    } catch (err) {
      throw new GraphQLError('Invalid or expired authentication token.', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
  }

  // Allow anonymous access to sign up and login
  if (req && req.body && req.body.operationName) {
    if (['signup', 'login'].includes(req.body.operationName.toLowerCase())) {
      return { prisma, user };
    }
  }

  // Check if user is authenticated for all other mutations
  if (req && req.body && req.body.operationName) {
    if (req.body.operationName.toLowerCase() === 'mutation' && !user) {

      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
  }

  return { prisma, user };
};
