export const typeDefs = `#graphql
    type User {
        id: Int
        userName: String
        email: String
        password: String
    }

    type Query {
        users: [User]
    }
    `;
