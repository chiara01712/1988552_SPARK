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
            carouselContent.innerHTML = '';

            if (notes.length === 0) {
                carouselContent.innerHTML = '<div class="box">No notes available</div>';
                return;
            }
            

            let id = 0; 
            notes.forEach((note, index) => {
                const isActive = index === 0 ? 'active' : '';
                const noteHtml = `
                    <div class="box ${isActive}" id="note-${id}">
                        <h2>${note.title}</h2>
                        ${note.file_url ? `<a href="${note.file_url}" target="_blank">Download File</a>` : ''}
                    </div>
                `;
                carouselContent.innerHTML += noteHtml;
                id++;
            });
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchNotes);

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



document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("noteModal");
    const openBtn = document.getElementById("openFormButton");
    const closeBtn = document.querySelector(".close-btn");
    
    
    // Open modal
    openBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Close modal when clicking on 'X'
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        else if (!event.target === menu ){
            document.getElementById("mySidebar").style.display = "none";
        }
        else if (!event.target === profile){
            document.getElementById("profileSidebar").style.display = "none";        }
    });

    // Handle form submission
    const noteForm = document.getElementById("noteForm");
    if(noteForm){
        console.log("noteForm",noteForm);
        noteForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const studentId = getCookie("user_Id");
            const courseId = document.getElementById("courseId").value;
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const fileUrl = document.getElementById("fileUrl").value;
            const fileType = document.getElementById("fileType").value;
            const data = {
                student_id: studentId,
                course_id: courseId,
                title: title,
                description: description,
                file_url: fileUrl,
                file_type: fileType
            };
            console.log("data",data);
            try {
                const response = await fetch("/addNote", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.status === 200) {
                    const result = await response.json();
                    console.log("Note added successfully:", result);
                } else {
                    console.error("Failed to add note:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding note:", error);
            }
            
        })
            


    } 

    document.getElementById("noteForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh
        fetchNotes(); // Refresh the notes after adding a new one
        modal.style.display = "none"; // Hide modal after submission
    });


});

// Request for the name of the student to user-service
async function fetchUsername() {
    const studentId = getCookie("user_Id");
    try{
        const response = await fetch('/getUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: studentId }),
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

// Fetch courses when the page loads
/*
async function fetchCourses() {
    console.log("Trying to fetch username");
    const studentId = getCookie("user_Id");
    try {
        const response = await fetch('/getCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: studentId }),
        });

        if(response.status === 200) {
            const res = await response.json();
            const courses = res.response
            
            console.log("Courses title fetched successfully:", courses);
            const carouselContent = document.getElementById('course-box');
            carouselContent.innerHTML = '';

            if (courses.length === 0) {
                carouselContent.innerHTML = '<div class="box">No submissions available</div>';
                return;
            }

            let id = 0; 
            courses.forEach((course, index) => {
                const isActive = index === 0 ? 'active' : '';
                const courseHtml = `
                    <div class="box ${isActive}" id="submission-${id}">
                        <h2>${course.course_title}</h2>
                    </div>
                `;
                carouselContent.innerHTML += courseHtml;
                id++;
        });
        }
        else{
            console.error("Failed to fetch student name:", response.statusText);
        }
    } catch (error) {
        console.error('Error fetching student name:', error);
    }
}
//document.addEventListener("DOMContentLoaded", fetchCourses);
*/