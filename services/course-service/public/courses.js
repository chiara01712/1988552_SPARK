
const container = document.getElementById("course-container");
const noResults = document.getElementById("no-results");

function openPopup(popup, overlay){
  document.getElementById(popup).classList.add("popupactive");
  document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function addCourse(popup,overlay){
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function open_Menu() {
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("overlaybar").classList.add("overlayactive");
}
function close_Menu() {
  document.getElementById("openNav").style.marginLeft = "0%";
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
function createCourseBox(title, category) {
  const box = document.createElement("div");
  box.className = "box";
  box.id = category;

  const h1 = document.createElement("h1");
  h1.textContent = title;
  box.appendChild(h1);
  return box;
}



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function coloreRandom() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function changeColor(){
  document.querySelectorAll('.box').forEach(box => {
    box.style.backgroundColor = coloreRandom();
    });
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
  try{
    const response = await fetch('/getCoursesByStudentId', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'student_id': studentId,
        },
        
    });

    if(response.status === 200) {
        const res = await response.json();
        if (!res || res.length === 0) {
          noResults.style.display = "block";
        }
        else {
          noResults.style.display = "none";
          res.forEach(course => {
            console.log(course);
            const box = createCourseBox(course.title, course.category || "uncategorized");
            container.appendChild(box);
          });
          changeColor();
        }
    }
  }
  catch(error){
    console.error("Error in LoadCourses",error);
  };
  };



document.addEventListener("DOMContentLoaded", loadCourses);

