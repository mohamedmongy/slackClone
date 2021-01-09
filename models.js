const { Sequelize, Model, DataTypes } = require('sequelize');
const pg = require('pg');

// for local DB 


const  sequelize = new Sequelize('slack', 'mongy', '', {
    host: 'localhost',
    dialect:  'postgres'
});

// User         
class User extends Model { }
User.init({
    name: {
       type: DataTypes.STRING,
       unique: true,
       validate: {
           isAlphanumeric: {
               args: true,
               msg: "will only allow alphanumeric characters, so allow only letters and numbers"
           },
           len: {
               args: [3,25],
               msg: " the user name need to be between 3 and 25 characters long"
            } 
       }
    },
   password: {
       type: DataTypes.STRING,
   },
    email: {
       type: DataTypes.STRING,
       unique: true,
       validate: {
        isEmail: {
            args: true,
            msg: "invalid Email!"
        }
    }
   }
   }, { sequelize, modelName: 'user' });

// Team  
class Team extends Model { }
Team.init({
    name: {
        type: DataTypes.STRING,
        unique: true
    }
}, { sequelize, modelName: 'team' });

// Channel  
class Channel extends Model { }
Channel.init({
    name: {
        type: DataTypes.STRING,
    },
    public: {
        type: DataTypes.BOOLEAN,
    },
}, { sequelize, modelName: 'channel' });

Channel.belongsTo(Team);

// UserTeams  
class UserTeam extends Model { }
UserTeam.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User, 
          key: 'id'
        }
    },
    teamId: {
        type: DataTypes.INTEGER,
        references: {
          model: Team, 
          key: 'id'
        }
    }
}, { sequelize, modelName: 'userTeam' });

class UserChannel extends Model { }
UserChannel.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User, 
          key: 'id'
        }
    },
    channelId: {
        type: DataTypes.INTEGER,
        references: {
          model: Channel, 
          key: 'id'
        }
    }
}, { sequelize, modelName: 'userChannel' });


// Many To Many RelationShips
User.belongsToMany(Team, { through: UserTeam });
Team.belongsToMany(User, { through: UserTeam });

User.belongsToMany(Channel, { through: UserChannel });
Channel.belongsToMany(User, { through: UserChannel });

Team.belongsTo(User, {
    foreignKey: 'owner',
});



// Message  
class Message extends Model { }
Message.init({
  text: DataTypes.STRING,
}, { sequelize, modelName: 'message' });

Message.belongsTo(Channel);
Message.belongsTo(User);



// Member  
class Member extends Model { }
Member.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'member' });


//  (async () => {
//   await sequelize.sync({ alter: true});
// })();

async function setupDB() {
    (async () => {
        await sequelize.sync({ alter: true});
    })();

  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}

setupDB()

const models = { User , Member , Message , Channel, Team, UserTeam, UserChannel } 
module.exports = { sequelize , setupDB, models: models }
