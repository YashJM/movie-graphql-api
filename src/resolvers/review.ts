import { GraphQLError } from 'graphql';
import { Context } from '../context/context';
import { authorize } from '../utils/auth';
import { CreateReviewInput } from '../common/types';

export const reviewResolver = {
    Query: {
        review: async (_parent: any, { id }: { id: number }, context: Context) => {
            const review = await context.prisma.review.findUnique({
                where: { id: id },
            });
            return review;
        },
        movieReviews: async (_parent: any, { movieId, filter, sort, pagination }: any, context: Context) => {
            try {
                let where = {
                    movieId
                };

                const user = context.user;

                if (filter) {
                    where = { ...where, ...filter };
                }

                let orderBy = {};
                if (sort) {
                    orderBy = { [sort.field]: sort.order };
                }

                let skip;
                let take;
                if (pagination) {
                    skip = pagination.skip || skip;
                    take = pagination.take || take;
                }

                let userReviews = [] as any;
                let otherReviews = [] as any;

                if (user) {
                    userReviews = await context.prisma.review.findMany({
                        where: { ...where, userId: user.id },
                        orderBy,
                    });

                    otherReviews = await context.prisma.review.findMany({
                        where: { ...where, NOT: { userId: user.id } },
                        orderBy,
                    });
                } else {
                    otherReviews = await context.prisma.review.findMany({
                        where,
                        orderBy,
                    });
                }

                let reviews = [...userReviews, ...otherReviews];

                if (take) {
                    reviews = reviews.slice(skip, skip + take);
                }

                return reviews;
            }
            catch (error) {
                throw new GraphQLError('Failed to fetch reviews.', {
                    extensions: { code: 'FETCH_VIEWS_ERROR' },
                });
            }
        },
    },
    Mutation: {
        createReview: async (_parent: any, { data }: { data: CreateReviewInput }, context: Context) => {
            try {
                const { movieId, rating, comment } = data;
                const userId = context.user?.id || -1;

                if (rating < 1 || rating > 10) {
                    throw new GraphQLError('Rating must be between 1 and 10', {
                        extensions: { code: 'INVALID_RATING' },
                    });
                }

                const review = await context.prisma.review.create({
                    data: {
                        userId,
                        movieId,
                        rating,
                        comment
                    }
                });

                return review;
            } catch (error: any) {
                if (error.extensions?.code === 'INVALID_RATING') {
                    throw error;
                }
                throw new GraphQLError('Failed to create movie ', {
                    extensions: { code: 'CREATE_REVIEW_ERROR' },
                });
            }
        },
        updateReview: async (_parent: any, { id, data }: { id: number, data: any }, context: Context) => {
            try {
                const userId = context.user?.id || -1;
                const review = await context.prisma.review.findUnique({ where: { id } });

                if (!review) {
                    throw new GraphQLError(`Review with ID ${id} not found. Nothing to delete.`, {
                        extensions: { code: 'REVIEW_NOT_FOUND_ERROR' },
                    });
                }

                authorize(userId, review!.userId);

                const updatedReview = await context.prisma.review.update({
                    where: {
                        id: id,
                    },
                    data: {
                        ...data
                    },
                });

                return updatedReview;
            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR' ||
                    error.extensions?.code === 'REVIEW_NOT_FOUND_ERROR'
                ) {
                    throw error;
                }
                throw new GraphQLError('Failed to update movie ', {
                    extensions: { code: 'UPDATE_REVIEW_ERROR' },
                });
            }
        },
        deleteReview: async (_parent: any, data: { id: number }, context: Context) => {
            try {
                const { id } = data;
                const userId = context.user?.id || -1;
                const review = await context.prisma.review.findUnique({ where: { id } });
                authorize(userId, review!.userId);
                if (!review) {
                    throw new GraphQLError(`Review with ID ${id} not found. Nothing to delete.`, {
                        extensions: { code: 'DELETE_REVIEW_ERROR' },
                    });
                }
                await context.prisma.review.delete({
                    where: {
                        id: id,
                    },
                });
                return { message: `REview with ID ${id} has been successfully deleted.` };
            }
            catch (error: any) {
                if (error.extensions?.code === 'UNAUTHORIZED_ACCESS_ERROR') {
                    throw error;
                }
                throw new GraphQLError('Failed to update movie ', {
                    extensions: { code: 'DELETE_REVIEW_ERROR' },
                });
            }
        }
    },
};
