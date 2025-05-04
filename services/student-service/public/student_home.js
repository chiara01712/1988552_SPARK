async function signOut() {
    console.log("Logout function called");
    try {
        // Send a request to localhost:8080 to clear the cookies
        const response = await fetch('http://localhost:8080/logout', {       
            method: 'POST',
            credentials: 'include' // Include credentials (cookies) in the request
        });
        if (response.status === 200) {
            console.log("Logout successful");
            window.location.href = 'http://localhost:8080/';
        }
    }
    catch (error) {
        console.error('Error during sign-out:', error);
    }

}

async function personalData() {
    console.log("Personal data function called");
    window.location.href = 'http://localhost:8080/personalData';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Fetch notes when the page loads
async function fetchNotes() {

    const studentId = getCookie("user_Id");
    try {
        const response = await fetch('/getNotes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'student_id': studentId,
            },
        });

        if(response.status === 200) {
            const notes = await response.json();
            console.log("Notes fetched successfully:", notes);
            const carouselContent = document.getElementById('note-box');
            if (notes.length === 0) {
                carouselContent.innerHTML='<div class="box"> No notes available</div>';
            }
            else {
                carouselContent.innerHTML = '';
                let id = 0; 
                notes.forEach((note, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const noteHtml = `
                        <div class="box ${isActive}" id="note-${id}">
                            <h2>${note.title}</h2> 
                            <i class="fa-regular fa-rectangle-xmark" id="bin" onClick=deleteNote('${note.id}')></i>
                            <h4 onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>
                            <h4> <a href="${note.file_url}" style="text-decoration=none;">Download File </a></h4>
                        </div>
                    `;
                    carouselContent.innerHTML += noteHtml;
                    id++;
                });
            }

            
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchNotes);
function showFile(file_type,url){
    console.log("entering show function");
    sessionStorage.setItem("url",url);
    sessionStorage.setItem("file_type", file_type);
    window.location.href = "notes_viewer.html";    
}
async function deleteNote(noteId){
    const note_id= noteId;
    console.log("Note id"+note_id);
    try {
        const response = await fetch('/deleteNote', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'note_id': note_id
            },
        });

        if(response.status === 200) {
            const res = await response.json();
            console.log("Note deleted successfully:", res);
            fetchNotes();
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
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
            const student = res.response
            
            console.log("Student name fetched successfully:", student);

            const welcomeMessage = document.getElementById('welcomeUser');
            if(welcomeMessage) {
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


function changeTag(tag){
    if ( tag == 'Arts & Design'){
      return("art");
    }
    if ( tag == 'Business & Management'){
      return("bam");
    }
    if ( tag == 'Communication & Media'){
      return("cam");
    }
    if ( tag == 'Engineering & Technology'){
      return("engandtech");
    }
    if ( tag == 'Health & Life Sciences'){
      return("handlife");
    }
    if ( tag == 'Humanities'){
      return("human");
    }
    if ( tag == 'Law & Legal Studies'){
      return("law");
    }
    if ( tag == 'Mathematical Sciences'){
      return("math");
    }
    if ( tag == 'Natural Sciences'){
      return("natty");
    }
    if ( tag == 'Social Sciences'){
      return("social");
    }
  }
  
async function fetchCourses() {
    const studentId = getCookie("user_Id");
    try{

        const response = await fetch('/getCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: studentId, target: "getCourses" }),
        });

        if(response.status === 200) {
            const res = await response.json();
            const courses = res.response;
            
            console.log("Courses fetched successfully:", courses);

             const carouselContent = document.getElementById('course-box');
             carouselContent.innerHTML = '';
             if (courses.length === 0) {
                 carouselContent.innerHTML = '<div class="box"> No courses available</div>';
                 return;
             }
             else if(courses == "courses not found"){
                console.log("courses not found");
                carouselContent.innerHTML = '<div class="box"> No courses available</div>';
                return;
            }
 
             courses.forEach((course, index) => {
                 const isActive = index === 0 ? 'active' : '';
                 const tag= changeTag(course.tag);
                 const courseHtml = `
                     <div class="box ${isActive}" id="${tag}">
                         <h2>${course.title}</h2>
                     </div>
                 `;
                 carouselContent.innerHTML += courseHtml;
                 
             });
        }
        else{
            console.error("Failed to fetch courses:", response.statusText);
        }
    }catch (error) {
        console.error('Error fetching courses :', error);
    }
}
document.addEventListener("DOMContentLoaded", fetchCourses);

async function viewAllNotes(){
    //redirect to my_note
    window.location.href = '/my_note';
}

async function viewAllCourses(){
    window.location.href = 'http://localhost:6060/getCoursesPage';
}

