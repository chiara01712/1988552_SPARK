function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
 

let quizzes = [];
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
            quizzes = await response.json();
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
    console.log("Rendering quizzes:", quizzes);
    console.log("Quizzes is of type:", typeof quizzes);
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
                <button class="take-quiz-btn" onclick="openQuizPopup('${quiz.id}')">
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


// Popup functionality
function openQuizPopup(quizId) {
    currentQuizId = quizId;
    const quiz = quizzes.find(q => q.id === quizId);
    console.log("Quiz ID:", quizId);
    if (!quiz) return;
    
    document.getElementById("popup-quiz-title").textContent = quiz.title;
    document.getElementById("popup-quiz-description").textContent = quiz.description;
    
    // Update progress bar
    document.getElementById("quiz-progress").style.width = "0%";
    
    // Clear previous questions
    document.getElementById("questions-container").innerHTML = '';
    
    // Add questions
    quiz.questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        
        let optionsHTML = '';
        question.options.forEach((option, oIndex) => {
            optionsHTML += `
                <div class="option-item">
                    <input type="radio" id="q${qIndex}-${oIndex}" name="q${qIndex}" value="${oIndex}">
                    <label for="q${qIndex}-${oIndex}">${option.text}</label>
                </div>
            `;
        });
        
        questionDiv.innerHTML = `
            <h3>${qIndex + 1}. ${question.text}</h3>
            <div class="options-list">
                ${optionsHTML}
            </div>
        `;
        
        document.getElementById('questions-container').appendChild(questionDiv);
    });
    
    // Display popup
    document.getElementById("quiz-overlay").classList.add("active");
    document.getElementById("quiz-popup").classList.add("active");
}

function closeQuizPopup() {
    document.getElementById("quiz-overlay").classList.remove("active");
    document.getElementById("quiz-popup").classList.remove("active");
    currentQuizId = null;
}


// Function to submit quiz
async function submitQuiz(event) {
    event.preventDefault();
    
    if (!currentQuizId) return;
    const quiz = quizzes.find(q => q.id === currentQuizId);
    if (!quiz) return;
    
    // Collect user answers
    const userAnswers = [];
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, qIndex) => {
        const selectedOption = document.querySelector(`input[name="q${qIndex}"]:checked`);
        
        if (selectedOption) {
            const answerIndex = parseInt(selectedOption.value);
            userAnswers.push(answerIndex);
            
            if (question.options[answerIndex].correct) {
                correctAnswers++;
            }
        } else {
            userAnswers.push(null); // No answer provided
        }
    });
    
    // Calculate score
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    const data  = {
        student_id: getCookie("user_Id"), 
        quiz_id: currentQuizId,
        answers: userAnswers,
        completed: true,
        score: score
    };

    console.log("Quiz data to be sent:", data);

    try {
        const response = await fetch("/addQuizAnswer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log("Quiz added successfully:", result);
            closeQuizPopup();
            renderQuizzes(quizzes);
        } else {
            console.error("Failed to add quiz:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding quiz:", error);
    }
    
}


document.addEventListener('DOMContentLoaded', getQuizzes);

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {

    // To add the course details to the page
    populateCourseDetails();

    
    // Quiz popup listeners
    document.getElementById("close-popup").addEventListener("click", closeQuizPopup);
    document.getElementById("cancel-btn").addEventListener("click", closeQuizPopup);
    document.getElementById("quiz-overlay").addEventListener("click", function(e) {
        if (e.target === this) {
            closeQuizPopup();
        }
    });
    
    // Quiz form submission
    document.getElementById("quiz-form").addEventListener("submit", function(event) {
        event.preventDefault();
        submitQuiz(event);
    });
   
    
    // Add progress tracking for quiz questions
    document.addEventListener('change', function(e) {
        if (e.target && e.target.type === 'radio' && e.target.name.startsWith('q')) {
            updateQuizProgress();
        }
    });
    
});

// Function to update quiz progress bar
function updateQuizProgress() {
    if (!currentQuizId) return;
    
    const quiz = quizzes.find(q => q.id === currentQuizId);
    if (!quiz) return;
    
    let answeredCount = 0;
    quiz.questions.forEach((_, qIndex) => {
        const selectedOption = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (selectedOption) {
            answeredCount++;
        }
    });
    
    const progressPercentage = (answeredCount / quiz.questions.length) * 100;
    document.getElementById("quiz-progress").style.width = `${progressPercentage}%`;
}