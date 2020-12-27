const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { sequelize , setupDB, models } = require('./models');
const { resolvers }  = require('./graphql/resolvers');
const { typeDefs }  = require('./graphql/types');


const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

setupDB();

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);