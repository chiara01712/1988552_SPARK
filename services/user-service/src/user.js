
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

// To create the table every time the server starts (deletes the table if it already exists)
// User.sync({force: true});


// Create a new user for testing
const { v4: uuidv4 } = require('uuid');

sequelize.sync({ force: true }) // Cambia a `false` per evitare di cancellare i dati
  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.create({
      id: '123e4567-e89b-12d3-a456-426614174000', 
      username: 'testuser',
      role: 'student',
      password: bcryptjs.hashSync('test@example.com', 10),
      email: 'test@example.com'
    });
  })
  .then(user => {
    console.log('User created:', user.toJSON());
  })
  .catch(err => {
    console.error('Error user creation:', err);
  });

module.exports = User; 


