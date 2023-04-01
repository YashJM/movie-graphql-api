export const reviewTypeDefs = `#graphql
    type Review {
        id: Int!
        movieId: Int!
        userId: Int!
        rating: Int!
        comment: String
    }

    input CreateReviewInput {
        movieId: Int!
        "Rating must be from 1-10"
        rating: Int!
        comment: String
    }

    input UpdateReviewInput {
        rating: Int!
        comment: String
    }

    # REVIEW PAGINATION

    enum SortOrder {
        asc
        desc
    }

    input ReviewFilter {
        name: String
        year: Int
        director: String
    }

    input ReviewSort {
        field: String
        order: SortOrder
    }

    input PaginationInput {
        skip: Int
        take: Int
    }

    type SuccessMessage {
        message: String!
    }
    
    type Query {
        review(id: Int!): Review
        movieReviews( movieId: Int!, filter: MovieFilter, sort: MovieSort, pagination: PaginationInput): [Review!]
    }

    type Mutation {
        createReview(data: CreateReviewInput!): Review,
        updateReview(id: Int!, data: UpdateReviewInput): Review
        deleteReview(id: Int!): SuccessMessage!
    }
`;
