
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("addbutton");
    const container = document.getElementById("containerbutton");

    button.addEventListener('click' , () => {
        
        if ( container.style.display === 'none'){
            container.style.display = 'block';
        }
        else{
            container.style.display ='none'
        }

        });
    }); 

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
        document.getElementById("main").style.marginLeft = "0%";
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

    function changeTag(box, tag, title){
        if ( tag == 'Computer Science'){
          box.classList.add("cs");
        }
        if ( tag == 'Math'){
          box.classList.add("math");
        }
        if ( tag == 'Science'){
          box.classList.add("science");
          title.style.color = 'black'
        }
        if ( tag == 'Tech'){
          box.classList.add("tech");
        }
      }

 
      function getQueryParams() {
        const params = {
          courseId: localStorage.getItem("courseId"),
          title: localStorage.getItem("title"),
          professor: localStorage.getItem("professor"),
          subject: localStorage.getItem("subject")
        };  
        return params;
      }

    // Popola i dettagli del corso
    function populateCourseDetails() {
        const {title, subject } = getQueryParams();
    
        // Controlla che gli elementi esistano nel DOM prima di modificarli
        const courseTitle = document.getElementById('courseTitle');
        courseTitle.textContent = title;
        const tagTitle = document.getElementById('titlebox');
        changeTag(tagTitle,subject,courseTitle);
    }


    async function publishMaterial() {
        const description = document.getElementById('Textarea').value.trim();
        const { courseId } = getQueryParams();
        if (!description) {
          alert('Please insert a description.');
          return;
        }
      
        try {
          const response = await fetch('/publishMaterial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              courseId: courseId, // Devi passare l'ID del corso
              description: description
            })
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const result = await response.json();
          console.log('Materiale pubblicato con successo:', result);
          loadMaterials(courseId);
          closePopup('popup', 'overlay'); // Chiude il popup
          document.getElementById('Textarea').value = ''; // Pulisce la textarea
        } catch (error) {
          console.error('Errore nella pubblicazione del materiale:', error);
        }
      }

      async function loadMaterials(courseId) {
        try {
          const response = await fetch(`/by-course-id/${courseId}`);
          
          if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
          }
      
          const materials = await response.json();

            const container = document.getElementById('publicationsContainer');
            container.innerHTML = ''; // pulisce
            const { professor } = getQueryParams();

            materials.forEach(mat => {
            const pub = document.createElement('div');
            pub.className = 'pubblication';

            const h1 = document.createElement('h1');
            h1.textContent = "Prof." + professor;
            pub.appendChild(h1);

            const h2 = document.createElement('h2');
            // formatta la data come preferisci:
            h2.textContent = new Date(mat.date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            pub.appendChild(h2);

            const span = document.createElement('span');
            pub.appendChild(span);

            const h3 = document.createElement('h3');
            h3.textContent = mat.description;
            pub.appendChild(h3);

            container.appendChild(pub);
            });

          console.log('Materiali trovati:', materials);
        } catch (error) {
          console.error('Errore durante il recupero dei materiali:', error);
        }
      }

      const { courseId } = getQueryParams();
      loadMaterials(courseId);

      function goToQuiz(){
        window.location.href = "../quiz/quiz_teacher.html";
      }

      function goToCourses(){
        window.location.href = "professor.html";
      }

    // Popola i dettagli quando la pagina è pronta
    document.addEventListener('DOMContentLoaded', populateCourseDetails);
    


   /*  
async function goHome() {
    const role = sessionStorage.getItem("userRole");
    if(role === "student"){
      // Redirect to the home page of the student-service
      window.location.href = "http://localhost:7070/home";
    }
    //if role is teacher
    else if(role === "teacher"){
        // Redirect to the home page of the teacher
        window.location.href = "./professor.html";  
    }
    
  } */