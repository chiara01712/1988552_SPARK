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
function open_Profile() {
    document.getElementById("profileSidebar").style.width = "25%";
    document.getElementById("profileSidebar").style.display = "block";
    document.getElementById("overlaysidebar").classList.add("overlayactive");
}
function close_Profile() {
document.getElementById("profileSidebar").style.display = "none";
document.getElementById("overlaysidebar").classList.remove("overlayactive");
}

  
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
            const courses = res.response
            
            console.log("Courses fetched successfully:", courses);

             const carouselContent = document.getElementById('course-box');
             carouselContent.innerHTML = '';

             if (courses.length === 0) {
                 carouselContent.innerHTML = '<div class="box"> No courses available</div>';
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
        console.error('Error fetching student name:', error);
    }
}
document.addEventListener("DOMContentLoaded", fetchCourses);
