export const typeDefs = `#graphql
    type User {
        id: Int
        userName: String
        email: String
        password: String
    }

    input SignUpInput {
        userName: String!
        email: String!
        password: String!
    }

    input LogInInput {
        email: String!
        password: String!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type Movie {
        id: Int
        name: String!
        description: String
        director: String
        releaseDate: String
    }

    type Query {
        users: [User],
        movies: [Movie]
    }

    type Mutation {
        signup(input: SignUpInput): AuthPayload
        login(input: LogInInput): AuthPayload
    }
`;
