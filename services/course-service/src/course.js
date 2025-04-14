const Sequelize = require('sequelize');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/coursesdb'
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

const Course = sequelize.define('course', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
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
  professor_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  student_ids: {
    type: Sequelize.ARRAY(Sequelize.UUID),
    allowNull: true
  },
}, {
  timestamps: false
});


const { v4: uuidv4 } = require('uuid');
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Course table ready.');

    // Creation example course
    return Course.findOrCreate({
      where:{
        id: '987e6543-e21b-45f6-a654-423354174999',
         
      },
      defaults: {
        title: 'Corso di esempio',
        professor_id: uuidv4(), 
        description: 'decription.',
        student_ids: ['123e4567-e89b-12d3-a456-426614174000'],
        uploaded_at: new Date()  
      }
    });
  })
  .then(([course,created]) => {
    if (created) {
      console.log('Course created:', course.toJSON());
    } else {
      console.log('Course already exists:', course.toJSON());
    }
  })
  .catch(err => {
    console.error('Error creation course:', err);
  });
module.exports = Course; 


