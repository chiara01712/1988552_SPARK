
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

function search(prefix) {
    const noResults = document.getElementById("no-results");

    const container = document.getElementById('course-container');
    const boxes = container.querySelectorAll('.box');
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

// Fetch notes when the page loads
async function fetchNotes() {
    const noResults = document.getElementById("no-results");
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
                            ${note.file_url ? `<a href="${note.file_url}" target="_blank">Download File</a>` : ''}
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


function openPopup(popup, overlay){
    document.getElementById(popup).classList.add("popupactive");
    document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
    document.getElementById(popup).classList.remove("popupactive");
    document.getElementById(overlay).classList.remove("overlayactive");
}

function addNote(popup,overlay){
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



document.addEventListener("DOMContentLoaded", function () {
    

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
        pop.style.display = "none"; // Hide modal after submission
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
