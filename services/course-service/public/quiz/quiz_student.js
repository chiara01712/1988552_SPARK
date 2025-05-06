function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function getQuizzes() {

    // TODO: Retrive the courseId from the session storage 
    try {
        const response = await fetch('/getQuizzes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'course_id': '123e4567-e89b-12d3-a456-426614174111',
            },
        });
        if (response.status === 200) {
            const quizzes = await response.json();
            console.log("Quizzes fetched successfully:", quizzes);
            renderQuizzes(quizzes); // Call the function to render quizzes
        }
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}

// Function for tab 
function changeTag(box, tag){
    if ( tag == 'Arts & Design'){
      box.classList.add("art");
    }
    if ( tag == 'Business & Management'){
      box.classList.add("bam");
    }
    if ( tag == 'Communication & Media'){
      box.classList.add("cam");
    }
    if ( tag == 'Engineering & Technology'){
      box.classList.add("engandtech");
    }
    if ( tag == 'Health & Life Sciences'){
      box.classList.add("handlife");
    }
    if ( tag == 'Humanities'){
      box.classList.add("human");
    }
    if ( tag == 'Law & Legal Studies'){
      box.classList.add("law");
    }
    if ( tag == 'Mathematical Sciences'){
      box.classList.add("math");
    }
    if ( tag == 'Natural Sciences'){
      box.classList.add("natty");
    }
    if ( tag == 'Social Sciences'){
      box.classList.add("social");
    }
  }

function getQueryParams() {
    return {
      courseId: localStorage.getItem("courseId"),
      title: localStorage.getItem("title"),
      professor: localStorage.getItem("professor"),
      subject: localStorage.getItem("subject")
    };
  }
  
  function populateCourseDetails() {
    const { title, subject } = getQueryParams();
    console.log("Course title:", title, "Subject:", subject);
    const courseTitle = document.getElementById('courseTitle');
    const tagTitle = document.getElementById('titlebox');
    if (courseTitle && tagTitle) {
      courseTitle.textContent = title;
      changeTag(tagTitle, subject);
    }
  }
  async function viewAllCourses(){
    window.location.href = 'http://localhost:6060/CoursePage';
 }
 //TODO: Function to see all the students enrolled in the course



// Menu functionality
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


// Function to render quizzes
function renderQuizzes(quizzes) {
    const quizzesContainer = document.getElementById('quizzes-list');
    quizzesContainer.innerHTML = '';
    
    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.classList.add('quiz-card');
        
        let quizContent = `
            <h2 class="quiz-title">
                ${quiz.title}
                ${quiz.completed ? '<span class="completed-badge">Completed</span>' : ''}
            </h2>
            <p class="quiz-description">${quiz.description}</p>
        `;
        
        // Add button or results based on completion status
        if (!quiz.completed) {
            quizContent += `
                <button class="take-quiz-btn" onclick="openQuizPopup(${quiz.id})">
                    <i class="fa-solid fa-play"></i> Take Quiz
                </button>
            `;
        } else {
            quizContent += `
                <div class="result-container" style="display: block;">
                    <div class="result-header">
                        <div class="result-score">
                            Your score: <span class="score-percentage ${getScoreClass(quiz.score)}">${quiz.score}%</span>
                        </div>
                        <button class="view-results-btn" onclick="toggleResults(${quiz.id})">
                            <i class="fa-solid fa-eye"></i> View Details
                        </button>
                    </div>
                    <div id="result-details-${quiz.id}" style="display: none;">
                        ${renderQuizResults(quiz)}
                    </div>
                </div>
            `;
        }
        
        quizCard.innerHTML = quizContent;
        quizzesContainer.appendChild(quizCard);
    });
}



document.addEventListener('DOMContentLoaded', getQuizzes);

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {

    // To add the course details to the page
    populateCourseDetails();
    
});