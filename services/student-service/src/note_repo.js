const { use } = require("./note_route");

class NoteRepo{

    constructor(noteModel){
        this.noteModel = noteModel;
    }

    async addNote(uuidV4, student_id, course_id, title, description, file_url, file_type) {
        console.log("AAA",student_id, course_id, title, description, file_url, file_type);
        try {
          const newNote = await this.noteModel.create({
            id: uuidV4,       // Set the generated UUID
            student_id,         // Insert the student_id
            course_id,          // Insert the course_id
            title,              // Insert the title
            description,        // Insert the description
            file_url,           // Insert the file_url
            file_type           // Insert the file_type
          });
          return newNote;     // Return the created note object
        } catch (error) {
          console.error("Error inserting user:", error);
          return null;        // Return null in case of an error
        }
      }

      async getNoteByUser(student_id) {
        try {
          return await this.noteModel.findAll({ where: { student_id } });
      } catch (erUserror) {
          console.error("Error fetching notes for student:", error);
          return [];
      }
    }

    async getNotesByStudentId(student_id) {

      const notes = await this.noteModel.findAll({ where: { student_id } });
      if(notes){
        const allDataValues = notes.map(note => note.dataValues);
        console.log(allDataValues);
        return allDataValues;  // Return the raw data
      } else{
          console.log("No notes found for student");
          return null;
      }
    }
    


} 

module.exports = {NoteRepo};