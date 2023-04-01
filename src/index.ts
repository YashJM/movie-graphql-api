import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { userTypeDefs } from './schema/userTypeDefs';
import { movieTypeDefs } from './schema/movieTypeDefs';
import { reviewTypeDefs } from './schema/reviewTypeDefs';

import { userResolver } from './resolvers/user';
import { movieResolver } from './resolvers/movie';
import { reviewResolver } from './resolvers/review';

import { createContext } from './context/context';

(async () => {
    const server = new ApolloServer({
        typeDefs: [userTypeDefs, movieTypeDefs, reviewTypeDefs],
        resolvers: [userResolver, movieResolver, reviewResolver],
    });

    const port = Number.parseInt(process.env.PORT as any) || 4000;

    const { url } = await startStandaloneServer(server, {
        listen: { port: port },
        context: createContext,
    });

    console.log(`🚀 Server listening at: ${url}`);
})();
