import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { userResolver } from './resolvers/user';
import { movieResolver } from './resolvers/movie';

import { typeDefs } from './schema/typeDefs';
import { movieDefs } from './schema/movieTypeDefs';

import { createContext } from './context/context';

(async () => {
    const server = new ApolloServer({
        typeDefs: [typeDefs, movieDefs],
        resolvers: [userResolver, movieResolver],
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: createContext,
    });

    console.log(`🚀 Server listening at: ${url}`);
})();
