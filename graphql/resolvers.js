
const  bcrypt = require('bcrypt');
const saltRounds = 12;

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
      register: async (parent, { password, ...otherArgs }, { models }, __ ) => {
        const hashedPassword =  await bcrypt.hash(password, saltRounds);
        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        console.log(` user >>>>> ${user.name}`)
        console.log(` user >>>>> ${user.email}`)
        console.log(` user >>>>> ${user.password}`)
        if (user) {
          return true 
        } else {
          return false
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