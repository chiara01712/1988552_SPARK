
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

function search(prefix) {
    const noResults = document.getElementById("no-results");

    const container = document.getElementById('note-box');
    const boxes = container.querySelectorAll('.box');
    let found = 0;
  
    boxes.forEach(box => {
      const text = box.querySelector('h2').textContent.toLowerCase();
      console.log(text);
      console.log(prefix);
      console.log(text.startsWith(prefix.toLowerCase()));
      if (text.startsWith(prefix.toLowerCase())) {
        box.style.display = 'block';
        found++;
      } else {
        box.style.display = 'none';
      }
    });
  
    //noResults.style.display = found === 0 ? 'block' : 'none';
  }
  
  // Esegui la funzione ogni volta che cambia l'input
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', () => {
      const value = input.value.trim();
      search(value);
    });
  });

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
                
                notes.forEach((note, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const id= changeTag(note.tag);
                    const noteHtml = `
                        <div class="box ${isActive}" id="${id}">
                            <h2>${note.title}</h2>
                            <i class="fa-regular fa-rectangle-xmark" id="bin" onClick=deleteNote('${note.id}')></i>
                            <h4 onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>
                            <h4> <a href="${note.file_url}" style="text-decoration=none;">Download File </a></h4>
                        </div>
                    `;
                    carouselContent.innerHTML += noteHtml;
                });
            }

            
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
}
function showFile(file_type,url){
    console.log("entering show function");
    sessionStorage.setItem("url",url);
    sessionStorage.setItem("file_type", file_type);
    window.location.href = "notes_viewer.html";    
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
    var select = document.createElement( 'select' );
    select.id="courseSelected";
    var option;
    var inputdata = JSON.parse(sessionStorage.getItem('courses'));
    option = document.createElement( 'option' );
    option.value = '';
    option.textContent = "None";
    select.appendChild( option );
    console.log(inputdata);
    inputdata.forEach((course,item) => {
        option = document.createElement( 'option' );
        option.value = course.title+","+course.tag;
        option.textContent = course.title;
        select.appendChild( option );
    });
    
    const label= document.createElement('laber');
    label.textContent="Course";
    label.for=select;
    const form= document.getElementById('noteForm');

    form.insertBefore(label, form.childNodes[5]);
    form.insertBefore(select, form.childNodes[6]);


    // Handle form submission
    const noteForm = document.getElementById("noteForm");
    if(noteForm){
        console.log("noteForm",noteForm);
        noteForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const studentId = getCookie("user_Id");
            const info =document.querySelector("#courseSelected").value.split(",");
            const courseTitle= info[0];
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const file = document.getElementById("file");
            const fileType = document.getElementById("fileType").value;
            if (!file.files[0]) {
                console.error("No file selected for upload.");
                return;
            }
            
            let fileNmae= "";            
            try {
                const formData = new FormData();
                formData.append('file', file.files[0]); // Append the file

                const v = await fetch("/upload", {
                    method: "POST",
                    body: formData, // Use FormData as the body
                });

                if (v.status === 200) {
                    const ret = await v.json();
                    console.log("File uploaded successfully:", ret);
                    fileNmae=ret.filename;
                } else {
                    console.error("Failed to add file:", v.statusText);
                }
            } catch (error) {
                console.error("Error adding file:", error);
            }
            let baseUrl = "./uploads/"+fileNmae;
            let tag_note= info[1];
            const data = {
                student_id: studentId,
                course_id: courseTitle,
                title: title,
                description: description,
                file_url: baseUrl,
                file_type: fileType,
                tag: tag_note
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
                    fetchNotes();
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
        document.getElementById('popup').classList.remove = "popupactive"; // Hide modal after submission
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

