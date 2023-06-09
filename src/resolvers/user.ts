import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { Context } from '../context/context';
import { authorize } from '../utils/auth';
import { validateSignUpInput } from '../utils/validations';
import { SignUpInput, LoginUpInput } from '../common/types';

export const userResolver = {
    Mutation: {
        signup: async (_parent: any, { input }: { input: SignUpInput }, context: Context) => {
            try {
                const { email, name, password } = input;

                const existingUser = await context.prisma.user.findUnique({ where: { email: email } });

                if (existingUser) {
                    throw new GraphQLError('User with this email address already exists', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
                }

                validateSignUpInput(email, password);

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await context.prisma.user.create({ data: { email, name, password: hashedPassword } });

                const token = jwt.sign(
                    { id: newUser.id, email: email },
                    process.env.JWT_SECRET || 'fallback_secret' as jwt.Secret,
                    { expiresIn: process.env.TOKEN_EXPIRY_TIME }
                );

                return {
                    token: token,
                    user: newUser
                }
            }
            catch (error: any) {
                if (error.extensions?.code === 'INPUT_VALIDATION_ERROR') {
                    throw error;
                }
                throw new GraphQLError('Failed to sign up.', {
                    extensions: { code: 'SIGNUP_ERROR' },
                });
            }
        },
        login: async (_parent: any, { input }: { input: LoginUpInput }, context: Context) => {
            try {
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
            catch (error) {
                throw new GraphQLError('Login Error.', {
                    extensions: { code: 'LOGIN_ERROR' },
                });
            }
        },
        changePassword: async (_parent: any, { input }: { input: { email: string, newPassword: string } }, context: Context) => {
            // Check if user exists
            const { email, newPassword } = input;

            try {
                const existingUser = await context.prisma.user.findUnique({ where: { email: email } });
                const userId = context.user?.id || -1;

                if (!existingUser) {
                    throw new GraphQLError('User with this email does not exist', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
                }

                authorize(userId, existingUser.id);

                // Update password
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await context.prisma.user.update({ where: { email: email }, data: { password: hashedPassword } });

                return { message: `Password has been successfully changed.` };
            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR') {
                    throw error;
                }
                throw new GraphQLError('Failed to update movie ', {
                    extensions: { code: 'UPDATE_PASSWORD_ERROR' },
                });
            }
        }
    },
};
