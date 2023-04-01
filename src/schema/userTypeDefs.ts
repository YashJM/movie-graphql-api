export const userTypeDefs = `#graphql
    type User {
        id: Int
        name: String
        email: String
        password: String
    }

    input SignUpInput {
        name: String!
        email: String!
        password: String!
    }

    input LogInInput {
        email: String!
        password: String!
    }

    input PasswordUpdateInput {
        email: String!
        newPassword: String!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type Mutation {
        signup(input: SignUpInput): AuthPayload
        login(input: LogInInput): AuthPayload
        changePassword(input: PasswordUpdateInput): User
    }
`;
