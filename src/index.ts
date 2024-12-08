import './db';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken'; 

const JWT_SECRET = 'j#M06LIwH@tkEWF7'; 

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: any) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        return { user: decoded };
      } catch (err) {
        throw new Error('Invalid or expired token');
      }
    }
    return {};
  },
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log('Server running at http://localhost:4000' + server.graphqlPath)
  );
};

startServer();
