import { Context } from '../context/context';

const MOVIES_PER_PAGE = 10;

export const movieResolver = {
    Query: {
        movies: async (_parent: any, { filter, sort, pagination, search }: any, context: Context) => {
            console.log(filter, sort, pagination, search);

        },
    },
    Mutation: {
        createMovie: async (_parent: any, { name, description, director, releaseDate }: any, context: Context) => {
            const movie = await context.prisma.movie.create({
                data: {
                    name,
                    description,
                    director,
                    releaseDate,
                },
            });

            return movie;
        },
    },
};
