
const container = document.getElementById("course-container");
const noResults = document.getElementById("no-results");

function openPopup(popupId, overlayId) {
  document.getElementById(popupId).classList.add("popupactive");
  document.getElementById(overlayId).classList.add("overlayactive");
}

// Chiude popup principale
function closePopup(popupId, overlayId) {
  document.getElementById(popupId).classList.remove("popupactive");
  document.getElementById(overlayId).classList.remove("overlayactive");

  // Pulisce i campi
  document.getElementById('course_name').value = '';
  document.getElementById('description').value = '';
}

// Apre il popup di ricerca
function openSearchPopup(popupId, overlayId) {
  document.getElementById(popupId).classList.add("popupactive");
  document.getElementById(overlayId).classList.add("overlayactive");

}
// Chiude il popup di ricerca
function closeSearchPopup(popupId, overlayId) {
  document.getElementById(popupId).classList.remove("popupactive");
  document.getElementById(overlayId).classList.remove("overlayactive");

  refreshCourseContainer();
}

function addCourse(popup, overlay) {
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function open_Menu() {
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("overlaybar").classList.add("overlayactive");
}
function close_Menu() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("overlaybar").classList.remove("overlayactive");
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


// Funzione per creare un box corso
function createCourseBox(title, category, prof_name) {
  const box = document.createElement("div");
  box.className = "box";

  const h1 = document.createElement("h1");
  h1.textContent = title;-
  box.appendChild(h1);

  const h2 = document.createElement("h2");
  h2.textContent = "Prof. "+prof_name; 
  box.appendChild(h2);
  return box;
}



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function changeTag(box, tag){
  if ( tag == 'Computer Science'){
    box.classList.add("cs");
  }
  if ( tag == 'Math'){
    box.classList.add("math");
  }
  if ( tag == 'Science'){
    box.classList.add("science");
  }
  if ( tag == 'Tech'){
    box.classList.add("tech");
  }
}



function search(prefix) {
  const container = document.getElementById('course-container');
  const boxes = container.querySelectorAll('.box');
  const noResults = document.getElementById('no-results');
  let found = 0;

  boxes.forEach(box => {
    const text = box.textContent.toLowerCase();
    if (text.startsWith(prefix.toLowerCase())) {
      box.style.display = 'block';
      found++;
    } else {
      box.style.display = 'none';
    }
  });

  noResults.style.display = found === 0 ? 'block' : 'none';
}

// Esegui la funzione ogni volta che cambia l'input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const value = input.value.trim();
    search(value);
  });
});


async function loadCourses() {
  const studentId = getCookie("user_Id");
  console.log("studentID : ", studentId);
  try {
    const response = await fetch('/getCoursesByStudentId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'student_id': studentId,
      },

    });

    if (response.status === 200) {
      const res = await response.json();
      if (!res || res.length === 0) {
        noResults.style.display = "block";
      }
      else {
        noResults.style.display = "none";
        res.forEach(course => {
          console.log(course);
          const box = createCourseBox(course.title, course.tag, course.professor_name|| "uncategorized");
          changeTag(box,course.tag);
          container.appendChild(box);
        });
        
      }
    }
  }
  catch (error) {
    console.error("Error in LoadCourses", error);
  };
};


function createResultBox(courseName, professorName, courseId, isSubscribed) {
  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");

  const courseTitle = document.createElement("h1");
  courseTitle.textContent = courseName;

  const professor = document.createElement("h2");
  professor.textContent = "Prof. " + professorName;

  const row = document.createElement("div");
  row.classList.add("title-row");

  const button = document.createElement('button');
  button.classList.add('subscribe-btn');
  button.dataset.courseId = courseId;

  // Stato iniziale del bottone
  button.textContent = isSubscribed ? 'Subscribed ✓' : 'Subscribe';
  if (isSubscribed) button.classList.add('subscribed');

  button.addEventListener('click', async () => {
    const studentId = getCookie('user_Id');
    const currentlySubscribed = button.classList.contains('subscribed');
    const endpoint = currentlySubscribed ? '/unsubscribeFromCourse' : '/subscribeToCourse';
    console.log("Invio richiesta per:", endpoint); // Debug
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId
        })
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Errore nella risposta: ${errorText}`);
      }
  
      if (res.ok) {
        console.log("Corso aggiornato con successo."); // Debug
        // Cambia il testo e lo stile del bottone
        if (currentlySubscribed) {
          button.textContent = 'Subscribe';
          button.classList.remove('subscribed');
        } else {
          button.textContent = 'Subscribed ✓';
          button.classList.add('subscribed');
        }
  
        // Aggiorna la lista dei corsi iscritti nel container
        await refreshCourseContainer();  // Ricarica il contenitore dei corsi dopo l'azione
      }
    } catch (err) {
      console.error("Errore nella fetch:", err);
    }
  });

  row.appendChild(courseTitle);
  row.appendChild(button);
  resultBox.appendChild(row);
  resultBox.appendChild(professor);

  return resultBox;
}

document.getElementById("add").addEventListener("click", searchCourses);

async function searchCourses() {
  const professor = document.getElementById("description").value.trim();
  const course = document.getElementById("course_name").value.trim();
  const studentId = getCookie('user_Id');
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  if (!professor && !course) {
    console.warn("Inserisci almeno il nome del professore o del corso.");
    return;
  }

  try {
    const response = await fetch('/getCoursesBySearch', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'professor_name': professor,
        'course_name': course ,
        'student_id': studentId 
      }
    });

    if (response.status === 200) {
      const res = await response.json();
      console.log("Corsi trovati:", res);
      
      if (res.length === 0) {
        resultsContainer.innerHTML = "<p>Oopss..no course has been found.</p>";
        return;
      }

      res.forEach(course => {
        const box = createResultBox(course.title, course.professor_name, course.id, course.isSubscribed);
        changeTag(box,course.tag); 
        resultsContainer.appendChild(box);
      });
    
    
  } 
    
    else {
      console.error("Errore nella richiesta:", response.status);
    }
  } catch (error) {
    console.error("Errore nella fetch:", error);
  }
}

async function refreshCourseContainer() {
  const studentId = getCookie("user_Id");
  const container = document.getElementById("course-container");

  // Pulizia contenitore
  container.innerHTML = "";

  // Ricrea manualmente il <p id="no-results">
  const noResults = document.createElement("p");
  noResults.id = "no-results";
  noResults.textContent = "Oopss...No course has been found";
  noResults.style.display = "none"; // lo nascondi finché non serve
  container.appendChild(noResults);

  try {
    const response = await fetch('/getCoursesByStudentId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'student_id': studentId,
      },
    });

    if (response.ok) {
      const courses = await response.json();

      if (!courses || courses.length === 0) {
        noResults.style.display = "block";
      } else {
        noResults.style.display = "none";
        courses.forEach(course => {
          const box = createCourseBox(course.title, course.tag ,course.professor_name || "uncategorized");
          changeTag(box,course.tag);
          container.appendChild(box);
        });
        
      }
    } else {
      console.error("Errore nel caricamento dei corsi iscritti.");
    }
  } catch (error) {
    console.error("Errore aggiornando i corsi iscritti:", error);
  }
}


document.addEventListener("DOMContentLoaded", loadCourses);

