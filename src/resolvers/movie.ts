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
            let where = {};

            if (filter) {
                where = { ...where, ...filter };
            }

            if (search) {
                where = {
                    ...where,
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ],
                };
            }

            let orderBy = {};
            if (sort) {
                orderBy = { [sort.field]: sort.order };
            }

            let skip = 0;
            let take = 10;
            if (pagination) {
                skip = pagination.skip || skip;
                take = pagination.take || take;
            }

            const movies = await context.prisma.movie.findMany({
                where,
                orderBy,
                skip,
                take,
            });

            return movies;
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
                throw new GraphQLError('Failed to create movie.', {
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
                throw new GraphQLError('Failed to update movie.', {
                    extensions: { code: 'UPDATE_MOVIE_ERROR' },
                });
            }
        },
        deleteMovie: async (_parent: any, data: { id: number }, context: Context) => {
            try {
                const { id } = data;
                const userId = context.user?.id || -1;
                const movie = await context.prisma.movie.findUnique({ where: { id } });

                if (!movie) {
                    throw new GraphQLError(`Movie with ID ${id} not found. Nothing to delete.`, {
                        extensions: { code: 'MOVIE_NOT_FOUND_ERROR' },
                    });
                }
                authorize(userId, movie!.createdBy);

                await context.prisma.movie.delete({
                    where: {
                        id: id,
                    },
                });

                return { message: `Movie with ID ${id} has been successfully deleted.` };
            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR' ||
                    error.extensions?.code === 'MOVIE_NOT_FOUND_ERROR'
                ) {
                    throw error;
                }
                throw new GraphQLError('Failed to delete movie.', {
                    extensions: { code: 'DELETE_MOVIE_ERROR' },
                });
            }
        }
    },
};
