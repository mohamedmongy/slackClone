const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { sequelize , setupDB, models } = require('./models');
const { resolvers }  = require('./graphql/resolvers');
const { typeDefs }  = require('./graphql/types');

const SECRET = "QWERTYUIUPAFGHJKLZZCBMQAZWSXEDCRFVTGBYHNUJM"
const SECRET2 = "puytrewq';lkjhgfda/.,mnbvcxzz/;p.o,kimjunh"


const server = new ApolloServer({ typeDefs, resolvers , context: { sequelize, models, SECRET, SECRET2, user: {id: 1} }});
const app = express();
server.applyMiddleware({ app });

setupDB();

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);