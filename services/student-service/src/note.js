const Sequelize = require('sequelize');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/studentsdb'
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

const Note = sequelize.define('note', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  student_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  course_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  file_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  file_type: {
    type: Sequelize.ENUM('pdf', 'doc', 'image'),
    allowNull: true
  },
  uploaded_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}, {
  timestamps: false
});

// userSchema.sync({ force: true })  // Set `force: true` to drop and recreate the table every time (useful in dev)
//   .then(() => {
//     console.log('User table has been created (or already exists).');
//   })
//   .catch((err) => {
//     console.error('Error creating user table:', err);
//   });

// To create the table every time the server starts (deletes the table if it already exists)
Note.sync({force: true});
module.exports = Note; 


