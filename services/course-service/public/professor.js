
const prof_id = "015a5b67-a570-4a7c-8f30-5ce374fac818"; // DA SOSTITUIRE CON QUELLI PASSATI DAL LOGIN
const prof_name = "Leonardi";


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function open_Profile() {
  document.getElementById("profileSidebar").style.width = "25%";
  document.getElementById("profileSidebar").style.display = "block";
  document.getElementById("overlaysidebar").classList.add("overlayactive");
}
function close_Profile() {
  document.getElementById("profileSidebar").style.display = "none";
  document.getElementById("overlaysidebar").classList.remove("overlayactive");
}


function openPopup(popup, overlay){
    document.getElementById(popup).classList.add("popupactive");
    document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
    document.getElementById(popup).classList.remove("popupactive");
    document.getElementById(overlay).classList.remove("overlayactive");
}


async function loadCourses() {
  const professorId = getCookie("user_Id");
    try {
      const response = await fetch('/getCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'professor_id': professorId  
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
      if(container.innerHTML=='')  
        container.innerHTML = '<p style="margin-left: 30px;">There are no courses at the moment... Add one!</p>'; // Pulisce il contenitore

    } catch (error) {
      console.error('Errore nella richiesta dei corsi:', error);
    }
  }
  
  // Chiamata al caricamento della pagina
  document.addEventListener("DOMContentLoaded", loadCourses);


  // Request for the name of the student to user-service
async function fetchUsername() {
  const studentId = getCookie("user_Id");
  try{
      const response = await fetch('/getUsername', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: studentId, target: "getUsername" }),
      });

      if(response.status === 200) {
          const res = await response.json();
          const student = res.response;
          console.log("In get Usernamr");
          console.log("Student name fetched successfully:", res);
        
          const welcomeMessage = document.getElementById('welcomeUser');
          if(welcomeMessage) {
            console.log(`Welcome, `+student);
              // Set the welcome message in the HTML element with ID 'welcomeUser'
              welcomeMessage.textContent = `Welcome, ${student}`;
          } else {
              console.error("Element with ID 'welcomeUser' not found.");
          }
      }
      else{
          console.error("Failed to fetch student name:", response.statusText);
      }
  } catch (error) {
      console.error('Error fetching student name:', error);
  }
}
document.addEventListener("DOMContentLoaded", fetchUsername);

// Access the value directly when needed
async function addCourse(popupId, overlayId) {
  const professorId = getCookie("user_Id");

  const titleInput = document.getElementById('course_name');
  const descriptionInput = document.getElementById('description');
  const subjectInput = document.querySelector('#subject');

  const welcomeMessage = document.getElementById('welcomeUser');
  const professorUsername= welcomeMessage.innerHTML;
  console.log("the Username for prof is: "+professorUsername+ "and Id:"+professorId);
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
                professor_id: professorId,
                professor_name: professorUsername,
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
  
