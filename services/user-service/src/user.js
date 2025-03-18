
const Sequelize = require('sequelize');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/usersdb'
}

const sequelize = new Sequelize(dbconfig.PostgresURI, {
  dialect: 'postgres'
});
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('unable to connect to database', err);
});

const User = sequelize.define('user', {
  id:{
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

// Ensure the 'users' table is created if it doesn't exist
// userSchema.sync({ force: true })  // Set `force: true` to drop and recreate the table every time (useful in dev)
//   .then(() => {
//     console.log('User table has been created (or already exists).');
//   })
//   .catch((err) => {
//     console.error('Error creating user table:', err);
//   });

// To create the table every time the server starts (deletes the table if it already exists)
User.sync({force: true});
module.exports = User; 


