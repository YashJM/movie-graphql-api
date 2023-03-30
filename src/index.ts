import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { userResolver } from './resolvers/user';
import { typeDefs } from './schema/typeDefs';
import { createContext } from './context/context';

(async () => {
    const server = new ApolloServer({
        typeDefs: [typeDefs],
        resolvers: [userResolver],
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: createContext,
    });
    console.log(process.env.JWT_SECRET);

    console.log(`🚀 Server listening at: ${url}`);
})();
