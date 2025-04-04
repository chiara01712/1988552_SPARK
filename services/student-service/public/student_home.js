

// async function fetchNotes() {
//     const studentId = "your-student-id-here"; // Replace with actual ID dynamically
//     try {
//         const response = await fetch(`api/notes?student_id=${studentId}`);
//         const notes = await response.json();
        
//         const carouselContent = document.getElementById('carousel-content');
//         carouselContent.innerHTML = '';

//         if (notes.length === 0) {
//             carouselContent.innerHTML = '<div class="text-center">No notes available</div>';
//             return;
//         }

//         notes.forEach((note, index) => {
//             const isActive = index === 0 ? 'active' : '';
//             const noteHtml = `
//                 <div class="carousel-item ${isActive}">
//                     <div class="card text-center p-3">
//                         <h5>${note.title}</h5>
//                         <p>${note.description || 'No description available'}</p>
//                         ${note.file_url ? `<a href="${note.file_url}" target="_blank">Download File</a>` : ''}
//                         <p><small>Uploaded on: ${new Date(note.uploaded_at).toLocaleDateString()}</small></p>
//                     </div>
//                 </div>
//             `;
//             carouselContent.innerHTML += noteHtml;
//         });
//     } catch (error) {
//         console.error('Error fetching notes:', error);
//     }
// }



// document.addEventListener('DOMContentLoaded', fetchNotes);

function open_Menu() {
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}

  function close_Menu() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
  }
  function open_Profile() {
    document.getElementById("profileSidebar").style.width = "25%";
    document.getElementById("profileSidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
  }
  function close_Profile() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("profileSidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
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
    });


    // Handle form submission
    const noteForm = document.getElementById("noteForm");
    if(noteForm){
        console.log("noteForm",noteForm);
        noteForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const studentId = document.getElementById("studentId").value;
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
                    fetchNotes(); // Refresh the notes after adding a new one
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
        modal.style.display = "none"; // Hide modal after submission
    });
});
