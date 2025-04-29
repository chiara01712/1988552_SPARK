
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