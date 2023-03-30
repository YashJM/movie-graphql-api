import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { userResolver } from './resolvers/user';
import { typeDefs } from './typeDefs/index';

(async () => {
    const server = new ApolloServer({
        typeDefs: [typeDefs],
        resolvers: [userResolver],
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });

    console.log(`🚀 Server listening at: ${url}`);
})();
