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
       unique: true
},
   password: {
       type: DataTypes.STRING,
   },
    email: {
       type: DataTypes.STRING,
       unique: true
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
          model: Team, 
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





// connect to postgres sql user om local 
//From CLI:
// $ su - mongy (OS username)
// paaword (OS password) 
// $ psql mongydb
// mongydb=# CREATE USER mongy_user WITH PASSWORD 'mongy_password';
// mongydb=# GRANT ALL PRIVILEGES ON DATABASE "mongydb" to mongy_user;
// mongydb=# \q

// \d   >> see all tables 
// \d tablename  >>  see table coloumns

// connect to heroku postgres on remote 
// cpoy and paste the following in your  CLI
// heroku pg:info  
// heroku pg:psql

// for live  heroku DB
// pg.defaults.ssl = true;
//postgres://username:password@host:port/database_name.
// postgres://hljjvyixjpvxzt:7a2f0642432a881c6ede6555e7262b892bdf6071924a3c014495e7da113f7b33@ec2-34-237-166-54.compute-1.amazonaws.com:5432/d28j977onra74h
// const sequelize = new Sequelize('postgres://hljjvyixjpvxzt:7a2f0642432a881c6ede6555e7262b892bdf6071924a3c014495e7da113f7b33@ec2-34-237-166-54.compute-1.amazonaws.com:5432/d28j977onra74h', {
    //         protocol: 'postgres',
//         dialect:  'postgres',
//         dialectOptions: {
//           ssl: {
//             require: true,
//             rejectUnauthorized: false // this fix unauthrized ssl self signed certificate error
//           }
//       }
// });