export const movieDefs = `#graphql
    type Movie {
        id: Int!
        name: String!
        description: String!
        director: String!
        releaseDate: String!
    }

    input MovieFilter {
        OR: [MovieFilter!]
        name_contains: String
        description_contains: String
        director_contains: String
    }

    enum MovieSortField {
        name
        director
        releaseDate
    }

    enum SortOrder {
        asc
        desc
    }

    input MovieSort {
        field: MovieSortField!
        order: SortOrder!
    }

    input MoviePagination {
        first: Int!
        skip: Int!
    }

    input MovieSearchInput {
	    query: String!
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

    type MovieConnection {
        pageInfo: PageInfo!
        edges: [MovieEdge!]!
    }

    type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: String
        endCursor: String
    }

    type MovieEdge {
        cursor: String!
        node: Movie!
    }

    type SuccessMessage {
        message: String!
    }

    type Query {
        movie(id: Int!): Movie
        movies(
            filter: MovieFilter
            sort: [MovieSort!]
            pagination: MoviePagination
            search: MovieSearchInput
        ): MovieConnection!
    }

    type Mutation {
        createMovie(data: CreateMovieInput!): Movie!
        updateMovie(id: Int!, data: UpdateMovieInput!): Movie!
        deleteMovie(id: Int!): SuccessMessage!
    }
`;
