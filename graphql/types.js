const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Userql {
    id: Int!
    name: String!
    email: String!
    teams: [Teamql]
  }

  type Channelql {
    id: Int!
    name: String!
    messages: [Messageql]!
    public: Boolean!
    users: [Userql]
  }

  type Messageql {
    id: Int!
    text: String!
    user: Userql!
    channel: Channelql!
  }

  type Teamql {
    id: Int!
    owner: Userql!
    users: [Userql]
    channels: [Channelql]
  }

  type Query {
    hello: String
  }
`;

module.exports = { typeDefs }