
const  bcrypt = require('bcrypt');
var _ = require('lodash');
const { Sequelize  } = require('sequelize');
const  { createTokens , refreshTokens, tryLogin } = require('./auth');


const saltRounds = 12;

const formatErrors = (e, models) => {
  if (e instanceof Sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

const resolvers = {
    Query: {
      hello: () => 'Hello there!',
      getUser: (parent, { id }, { sequelize , models }, __ ) => {
       return models.User.findOne({ where: {id} });
      },
      allUsers: (_, __, { models }, ___ ) => {
        return  models.User.findAll();
      },
      allTeams: (_, __, { models }, ___ ) => {
        return  models.Team.findAll();
      },
      allChannels: (_, __, { models }, ___ ) => {
        return  models.Channel.findAll();
      },
      allMessages: (_, __, { models }, ___ ) => {
        return  models.Message.findAll();
      }
    },
    Mutation:  {
      login: (parent, { email, password }, { models, SECRET, SECRET2 }, __ ) => {
        console.log(email, password, SECRET, SECRET2)
        return tryLogin(email, password, models, SECRET,SECRET2)
      },
      register: async (parent, { password, ...otherArgs }, { models }, __ ) => {

        if (password.length < 5) {
          return {
            ok: false,
            errors: [{ path: "REGISTER" , message: "the password need to be greater than 5 characters long!"}]
          }
        }

        try {
          const hashedPassword =  await bcrypt.hash(password, saltRounds);
          const user = await models.User.create({ ...otherArgs, password: hashedPassword });
          console.log(` user >>>>> ${user.name}, ${user.email}, ${user.password}`)
          if (user) {
            return {
              ok: true,
              user: user
            } 
          } else {
            return {
              ok: false,
              errors: [{ path: "REGISTER", message: "please try again some thing went wrong!" }]
            } 
          }
        } catch(err) {
          return {
            ok: false,
            errors: formatErrors(err, models)
          }
        }
      },
      createTeam: async (parent, args, { models , user}, __ ) => {
        try {
          // TODO: remove the default value 1 and pass dynamic user
        await models.Team.create({...args, owner: "1"});
        return true
        } catch(err) {
          console.log(err)
          return false
        }
      },
      createChannel: async (parent, args, { models }, __ ) => {
        try {
        // TODO: remove the default value 1 and pass dynamic user
        await models.Channel.create({...args, teamId: "1"});
        return true
        } catch(err) {
          console.log(err)
          return false
        }
      },
      createMessage: async (parent, args, { models }, __ ) => {
        try {
        // TODO: remove the default value 1 and pass dynamic user
        await models.Message.create({...args, userId: "1", channelId: "1"});
        return true
        } catch(err) {
          console.log(err)
          return false
        }
      }

    }
  };

  module.exports = { resolvers }