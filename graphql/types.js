const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type ErrorQl {
    path: String
    message: String
  }

  type RegisterResponse {
    ok: Boolean
    user: Userql
    errors: [ErrorQl]
  }

  type LoginResponse {
    ok: Boolean
    token: String
    refreshToken: String
    errors: [ErrorQl]
  }

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
    name: String!
    owner: Userql!
    users: [Userql]
    channels: [Channelql]
  }

  type Query {
    hello: String
    getUser(id: String): Userql!
    allUsers: [Userql]
    allTeams: [Teamql]
    allChannels: [Channelql]
    allMessages: [Messageql]
  }

  type Mutation {
    # USER
    register(name: String, email: String, password: String): RegisterResponse
    login(email: String!, password: String!): LoginResponse

    #TEAM
    createTeam(name: String): Boolean

    #CHANNNEL
    createChannel(teamId: Int,name: String,public: Boolean): Boolean

   #MESSAGE
    createMessage(channelId: Int, text: String): Boolean
  }

`;

module.exports = { typeDefs }