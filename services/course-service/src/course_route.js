const express = require('express');
const { CourseService } = require('./course_service');
const { CourseRepo } = require('./course_repo');
const RabbitMQCourse = require('./rabbitmq/course-s');

const {Course, Quiz, QuizAnswer, Material} = require("./course");
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 

const router = express.Router();
const courseRepo = new CourseRepo(Course, Quiz, QuizAnswer,Material);
const courseService = new CourseService(courseRepo);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));;
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const uniqueSuffix = uuidv4(); 
    const finalName = `${nameWithoutExt}_${uniqueSuffix}${ext}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage: storage });

router.get('/getCourses', async (req, res) => {
    try {
        const response = await courseService.getCoursesByProfessorId (req, res);
        //console.log("Response, courses:",response);
        
        if (response.status === 200) {
            res.json(response.data); // Send the courses as JSON response
        }
        else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addCourse', async (req, res) => {
  try {
      const response = await courseService.addCourse(req);
      if (response.status === 200) {
          res.status(200).json({ message: 'Course added successfully', course: response.course });
      } else {
          res.status(response.status).json({ error: response.message });
      }
  } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addStudentToCourse', async (req, res) => {
  try {
    const response = await courseService.addStudentToCourse(courseId, studentId);

  } catch (error) {
    console.error('Error adding student to course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/getUsername", async (req, res, next) => {
  console.log("/getUsername",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const { randomUUID } = require("crypto");
    const correlationId = randomUUID();
    const replyToQueue = "rpc_queue"; // or fetch it from config if needed
    const response = await RabbitMQCourse.produce(req.body, correlationId, replyToQueue);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});
  
  
router.get("/home", (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
      // Verify the token using the same secret key used for signing
      const decoded = jwt.verify(token, '220fcf11de0e3f9307932fb2ff69258d190ecf08ef01d0d9c5d8d1c7c97d9149be27299a3ce8dfa0cbbfb6dc1328291786803344cdbf7f3916933a78ac47553e');
      console.log("Authenticated user: ",decoded);
      
      res.sendFile(path.join(__dirname, '..', 'public', 'professor.html'));
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
});

router.get('/getCoursesByStudentId', async (req,res) => {
  try {
      const response = await courseService.getCoursesByStudentId(req);
      if (response.status === 200) {
          res.json(response.data);
      } else {
          res.status(response.status).json({ message: response.message });
      }
  } catch (error) {
      console.error('Error fetching courses by student ID:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getCoursesBySearch', async (req, res) => {
  try {
    const response = await courseService.getCoursesBySearch(req);

    if (response.status === 200) {
      res.json(response.data);
    }
  }
  catch(error){
    console.log("Error in GetCoursesBySearch");
  }
});

router.get("/getCoursesPage", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, '220fcf11de0e3f9307932fb2ff69258d190ecf08ef01d0d9c5d8d1c7c97d9149be27299a3ce8dfa0cbbfb6dc1328291786803344cdbf7f3916933a78ac47553e');
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'courses.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/getQuizzes', async (req, res) => {
  try { 
    const response = await courseService.getQuizzesByCourseId(req,res); // Fetch quizzes by course ID
    console.log("Response, quizzes:",response);
    if (response.status === 200) {
      console.log("typeof response.data:",typeof response.data);
      res.json(response.data); // Send the quizzes as JSON response
    } else {
      res.status(response.status).json({ message: response.message });
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addQuiz', async (req, res) => {
  try {
    const response = await courseService.addQuiz(req, res); // Add a quiz to the course
    res.status(response.status).json({ message: response.message });

  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/publishMaterial', upload.single('file'), async (req, res) => {
  try {
    // Log dei dati ricevuti
    console.log('Dati ricevuti:', req.body);
    console.log('File ricevuto:', req.file);

    const file = req.file;

    // Se non è stato caricato un file, file_url sarà null e file_type non sarà definito
    let file_url = null;
    let file_type = null;

    // Gestione file (se presente)
    if (file) {
      file_url = path.join('/uploads', file.filename);

      const mt = file.mimetype;
      if (mt === 'application/pdf') {
        file_type = 'pdf';
      } else if (mt.startsWith('image/')) {
        file_type = 'image';
      } else if (mt.startsWith('video/')) {
        file_type = 'video';
      } else if (mt === 'application/msword' ||
                mt === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        file_type = 'doc';
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
    }

    // Prepara i dati per inviarli al servizio (anche senza file)
    const data = {
      courseId: req.body.courseId,
      description: req.body.description,
      file_url,  // Se non ci sono file, questo sarà null
      file_type  // Se non ci sono file, questo sarà null
    };

    // Log dei dati prima di inviarli al servizio
    console.log('Dati preparati per il servizio:', data);

    // Chiama il servizio per pubblicare il materiale
    const result = await courseService.publishMaterial(data);

    // Restituisce la risposta al client
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error publishing material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/by-course-id/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await courseService.getMaterialsByCourseId(courseId);
    res.status(200).json(materials);
  } catch (err) {
    console.error('Errore nel recupero materiali per ID:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

router.get('/getStudentsByCourseID/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const students = await courseService.getStudentsByCourseID(courseId);

    // Aggiungi un log per vedere cosa ricevi
    console.log('Studenti per corso:', students);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Course not found or no students' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/subscribeToCourse', async (req, res) => {
  const { student_id, course_id } = req.body;
  console.log("Student ID:", student_id, "Course ID:", course_id);
  try {
    await courseService.subscribeToCourse(student_id, course_id);
    res.status(200).send("Iscritto al corso");
  } catch (err) {
    console.error("Errore in /subscribeToCourse:", err); // <--- LOG DETTAGLIATO
    res.status(500).send("Errore iscrizione");
  }
});

router.post('/unsubscribeFromCourse', async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    await courseService.unsubscribeFromCourse(student_id, course_id);
    res.status(200).send("Disiscritto dal corso");
  } catch (err) {
    res.status(500).send("Errore disiscrizione");
  }
});


  
module.exports = router;