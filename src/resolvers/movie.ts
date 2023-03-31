import { Context } from '../context/context';

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
            const { name, description, director, releaseDate } = data;
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
        updateMovie: async (_parent: any, { id, data }: any, context: Context) => {
            const updatedMovie = await context.prisma.movie.update({
                where: {
                    id: id,
                },
                data: {
                    ...data
                },
            });
            return updatedMovie;
        },
        deleteMovie: async (_parent: any, data: { id: number }, context: Context) => {
            const { id } = data;
            await context.prisma.movie.delete({
                where: {
                    id: id,
                },
            });

            return { message: `Movie with ID ${id} has been successfully deleted` };
        }
    },
};
