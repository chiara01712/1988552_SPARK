
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');

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
  role: {
      type: Sequelize.ENUM('teacher', 'student')
    },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
});


// Create a new user for testing
const { v4: uuidv4 } = require('uuid');

sequelize.sync({ force: false }) // if false it will not drop the table if it exists
  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('test@example.com', 10),
      email: 'test@example.com'
      }
    });
  })
  .then(([user, created]) => {
    if(created) {
      console.log('User created:', user.toJSON());
    }
    else {
      console.log('User already exists:', user.toJSON());
    }
  })
  .catch(err => {
    console.error('Error creating user:', err);
});

module.exports = User; 


