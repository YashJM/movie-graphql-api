import { GraphQLError } from 'graphql';
import { Context } from '../context/context';
import { authorize } from '../utils/auth';

export const movieResolver = {
    Query: {
        movie: async (_parent: any, { id }: { id: number }, context: Context) => {
            const movie = await context.prisma.movie.findUnique({
                where: { id: id },
            });
            return movie;
        },
        movies: async (_parent: any, { filter, sort, pagination, search }: any, context: Context) => {
            // console.log(filter, sort, pagination, search);
        },
    },
    Mutation: {
        createMovie: async (_parent: any, { data }: any, context: Context) => {
            try {
                const { name, description, director, releaseDate } = data;
                const userId = context.user?.id || -1;

                const movie = await context.prisma.movie.create({
                    data: {
                        name,
                        description,
                        director,
                        releaseDate,
                        user: { connect: { id: userId } },
                    },
                });

                return movie;
            } catch (error: any) {
                throw new GraphQLError('Failed to create movie ', {
                    extensions: { code: 'CREATE_MOVIE_ERROR' },
                });
            }
        },
        updateMovie: async (_parent: any, { id, data }: any, context: Context) => {
            try {
                const userId = context.user?.id || -1;
                const movie = await context.prisma.movie.findUnique({ where: { id } });

                authorize(userId, movie!.createdBy);

                const updatedMovie = await context.prisma.movie.update({
                    where: {
                        id: id,
                    },
                    data: {
                        ...data
                    },
                });
                return updatedMovie;
            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR') {
                    throw error;
                }
                throw new GraphQLError('Failed to update movie ', {
                    extensions: { code: 'UPDATE_MOVIE_ERROR' },
                });
            }
        },
        deleteMovie: async (_parent: any, data: { id: number }, context: Context) => {
            try {
                const { id } = data;

                const userId = context.user?.id || -1;
                const movie = await context.prisma.movie.findUnique({ where: { id } });

                authorize(userId, movie!.createdBy);

                await context.prisma.movie.delete({
                    where: {
                        id: id,
                    },
                });

                return { message: `Movie with ID ${id} has been successfully deleted` };

            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR') {
                    throw error;
                }
                throw new GraphQLError('Failed to update movie ', {
                    extensions: { code: 'DELETE_MOVIE_ERROR' },
                });
            }
        }
    },
};
