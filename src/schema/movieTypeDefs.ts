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

    input UpdateMovieInput {
        id: Int!
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

    type Query {
        movies(
        filter: MovieFilter
        sort: [MovieSort!]
        pagination: MoviePagination
        search: MovieSearchInput
        ): MovieConnection!
    }

    type Mutation {
        createMovie(
        name: String!
        description: String!
        director: String!
        releaseDate: String!
        ): Movie!
    }
`;
