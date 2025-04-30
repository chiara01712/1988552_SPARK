const prof_id = "015a5b67-a570-4a7c-8f30-5ce374fac818"; // DA SOSTITUIRE CON QUELLI PASSATI DAL LOGIN
const prof_name = "Leonardi";



function openPopup(popup, overlay){
    document.getElementById(popup).classList.add("popupactive");
    document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
    document.getElementById(popup).classList.remove("popupactive");
    document.getElementById(overlay).classList.remove("overlayactive");
}

async function loadCourses() {

    try {
      const response = await fetch('/getCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'professor_id': prof_id  
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const courses = await response.json(); // I dati ricevuti
      console.log("Corsi ricevuti:", courses);
  
      const container = document.getElementById('coursesContainer');
      container.innerHTML = ''; // Pulisce il contenitore
  
      courses.forEach(course => {
        const box = document.createElement('div');
        box.className = 'box';
        box.id = course.tag ? course.tag.toLowerCase().replace(/\s+/g, '-') : `course-${course.id}`;

        box.addEventListener('click', () => {
          // Crea l'URL con i parametri
          localStorage.setItem("courseId", course.id);
          localStorage.setItem("title", course.title);
          localStorage.setItem("professor", course.professor_name);
          localStorage.setItem("subject", course.tag);
          
          // Reindirizza alla pagina (senza passare parametri in URL)
          window.location.href = "course_home.html";
        });

        box.innerHTML = `<h1>${course.title}</h1>`;
        container.appendChild(box);
      });
    } catch (error) {
      console.error('Errore nella richiesta dei corsi:', error);
    }
  }

const subjectInput = document.getElementById('subject');



// Access the value directly when needed
async function addCourse(popupId, overlayId) {
  const titleInput = document.getElementById('course_name');
  const descriptionInput = document.getElementById('description');
  const subjectInput = document.querySelector('#subject');
  
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const subject = subjectInput.value.trim(); 
  console.log("the subject is: "+subject);
  if (!title || !description || !subject) {
    alert('Please fill all the fields.');
    return;
  }

    try {
        const response = await fetch('/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                professor_id: prof_id,
                professor_name: prof_name,
                tag: subject // Use the selected subject
            })
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        console.log('Response Body:', responseData);

        // Reload courses to include the new course
        console.log('Reloading courses...');
        await loadCourses();

        // Close the popup
        closePopup(popupId, overlayId);

        // Clear input fields
        titleInput.value = '';
        descriptionInput.value = '';
        subjectInput.value = '';
    } catch (error) {
        console.error('Error adding course:', error);
    }
}
  
  // Chiamata al caricamento della pagina
  loadCourses();


