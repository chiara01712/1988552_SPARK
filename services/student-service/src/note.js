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
}, {
  timestamps: false
});

// To create the table every time the server starts (deletes the table if it already exists)
//Note.sync({force: true});

const { v4: uuidv4 } = require('uuid');
sequelize.sync({ force: true }) 
  .then(() => {
    console.log('Tabella delle note sincronizzata.');

    // Creation example note
    return Note.create({
      id: '987e6543-e21b-45f6-a654-423354174999',  
      student_id: '123e4567-e89b-12d3-a456-426614174000', 
      course_id: uuidv4(), 
      title: 'Nota di esempio',
      description: 'decription.',
      file_url: 'https://example.com/file.pdf',
      file_type: 'pdf',
      uploaded_at: new Date()  
    });
  })
  .then(note => {
    console.log('Note created:', note.toJSON());
  })
  .catch(err => {
    console.error('Error creation note:', err);
  });
module.exports = Note; 


