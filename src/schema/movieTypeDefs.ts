export const movieTypeDefs = `#graphql
    type Movie {
        id: Int!
        name: String!
        description: String!
        director: String!
        releaseDate: String!
    }

    input CreateMovieInput {
        name: String!
        description: String!
        director: String
        releaseDate: String
    }

    input UpdateMovieInput {
        name: String
        description: String
        director: String
        releaseDate: String
    }

    # PAGINATION 

    enum SortOrder {
        asc
        desc
    }

    input MovieFilter {
        name: String
        year: Int
        director: String
    }

    input MovieSort {
        field: String
        order: SortOrder
    }

    input PaginationInput {
        skip: Int
        take: Int
    }

    type MovieList {
        movies: [Movie!]
        totalCount: Int
    }

    type SuccessMessage {
        message: String!
    }

    type Query {
        movie(id: Int!): Movie
        movies( filter: MovieFilter, sort: MovieSort, pagination: PaginationInput, search: String): [Movie!]
    }

    type Mutation {
        createMovie(data: CreateMovieInput!): Movie!
        updateMovie(id: Int!, data: UpdateMovieInput): Movie!
        deleteMovie(id: Int!): SuccessMessage!
    }
`;
