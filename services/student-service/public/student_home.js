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
            const noResults = document.getElementById("no-results");
            if (notes.length === 0) {
                noResults.style.display = "block";
            }
            else {
                noResults.style.display = "none"; 
                carouselContent.innerHTML = '';
                let id = 0; 
                notes.forEach((note, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const noteHtml = `
                        <div class="box ${isActive}" id="note-${id}">
                            <h2>${note.title}</h2>
                            <h4 onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>
                            <h4 href="${note.file_url}" download>Download File</h4>
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
    if(file_type=="image"){
        document.getElementById('overlay').classList.add("overlayactive");
        document.getElementById('overlay').innerHTML+= `<embed type="image/png" src="`+url+`" width="500" height="400" >`;
    }
    
    else {
        document.getElementById('overlay').classList.add("overlayactive");
        document.getElementById('overlay').innerHTML+= `
        
    <embed src="`+url+`" type="application/pdf" width="100%" height="100%">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="`+url+`">Download PDF</a>.</p>
    </embed> 
`;

    }
}
function closeOverlay(overlay){
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
                console.log("error in the response from courses");
                 carouselContent.innerHTML = '<div class="box">No courses available</div>';
                 return;
             }
             else if(courses == "courses not found"){
                console.log("courses not found");
                carouselContent.innerHTML = '<div class="box">No courses available</div>';
                return;
            }

             let id = 0; 
             courses.forEach((course, index) => {
                 const isActive = index === 0 ? 'active' : '';
                 const courseHtml = `
                     <div class="box ${isActive}" id="courses-${id}">
                         <h2>${course.title}</h2>
                     </div>
                 `;
                 carouselContent.innerHTML += courseHtml;
                 id++;
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

