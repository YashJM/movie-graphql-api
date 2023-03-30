import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { Context } from '../context/context';

interface SignUpInput {
    userName: string
    email: string
    password: string
}

interface LoginUpInput {
    email: string
    password: string
}

export const userResolver = {
    Query: {
        users: () => {
            return [];
        },
    },
    Mutation: {
        signup: async (_parent: any, { input }: { input: SignUpInput }, context: Context) => {
            const { email, userName, password } = input;

            const existingUser = await context.prisma.user.findUnique({ where: { email: email } });

            if (existingUser) {
                throw new GraphQLError('User with this email address already exists', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await context.prisma.user.create({ data: { email, userName, password: hashedPassword } });

            const token = jwt.sign(
                { id: newUser.id, email: email },
                process.env.JWT_SECRET || 'fallback_secret' as jwt.Secret,
                { expiresIn: process.env.TOKEN_EXPIRY_TIME }
            );

            return {
                token: token,
                user: newUser
            }
        },

        login: async (_parent: any, { input }: { input: LoginUpInput }, context: Context) => {
            const { email, password } = input;

            const user = await context.prisma.user.findUnique({
                where: { email: email },
            });

            if (!user) {
                throw new GraphQLError('User with this email does not exists', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
            }

            const valid = await bcrypt.compare(
                password,
                user.password,
            );

            if (!valid) {
                throw new GraphQLError('Invalid password', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
            }

            const token = jwt.sign({ id: user.id, email: email },
                process.env.JWT_SECRET || 'fallback_secret' as jwt.Secret,
                { expiresIn: process.env.TOKEN_EXPIRY_TIME });

            return {
                token,
                user,
            };
        }
    },
};
