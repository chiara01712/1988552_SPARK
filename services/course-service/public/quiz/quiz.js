
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

// Popup functionality
function openQuizPopup() {
    document.getElementById("quiz-overlay").classList.add("active");
    document.getElementById("quiz-popup").classList.add("active");
}

function closeQuizPopup() {
    document.getElementById("quiz-overlay").classList.remove("active");
    document.getElementById("quiz-popup").classList.remove("active");
    // Reset form
    document.getElementById("quiz-form").reset();
    document.getElementById("questions-container").innerHTML = "";
}

// Function to add a new question form
function addQuestionForm() {
    const questionIndex = document.querySelectorAll('.question-form').length;
    
    const questionForm = document.createElement('div');
    questionForm.classList.add('question-form');
    questionForm.innerHTML = `
        <div class="form-group">
            <label for="question-${questionIndex}">Question ${questionIndex + 1}</label>
            
            <input type="text" id="question-${questionIndex}" placeholder="Enter your question" required>
            
        </div>
        
        <div class="options-container" id="options-container-${questionIndex}">
            <div class="option-form" style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="correct-${questionIndex}" checked>
                <input type="text" placeholder="Option 1" required>
                <button type="button" class="remove-btn" onclick="removeOption(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="option-form" style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="correct-${questionIndex}">
                <input type="text" placeholder="Option 2" required>
                <button type="button" class="remove-btn" onclick="removeOption(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; width: 100%;">
        <button type="button" class="add-option-btn" onclick="addOption(${questionIndex})">
            <i class="fa-solid fa-plus"></i> Add Option
        </button>
        <button type="button" class="remove-question-btn" onclick="removeQuestion(this)">
            <i class="fa-solid fa-trash"></i> Remove Question
        </button>
    </div>
    `;
    
    document.getElementById('questions-container').appendChild(questionForm);
}

// Function to add a new option to a question
function addOption(questionIndex) {
    const optionsContainer = document.getElementById(`options-container-${questionIndex}`);
    const optionCount = optionsContainer.children.length;
    
    const optionForm = document.createElement('div');
    optionForm.classList.add('option-form');
    optionForm.style.display = 'flex';
    optionForm.style.alignItems = 'center';
    optionForm.style.gap = '10px';
    optionForm.innerHTML = `
        <input type="radio" name="correct-${questionIndex}">
        <input type="text" placeholder="Option ${optionCount + 1}" required>
        <button type="button" class="remove-btn" onclick="removeOption(this)">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    optionsContainer.appendChild(optionForm);
}

// Function to remove an option
function removeOption(button) {
    const optionForm = button.parentElement;
    const optionsContainer = optionForm.parentElement;
    
    // Only remove if there are more than 2 options
    if (optionsContainer.children.length > 2) {
        optionsContainer.removeChild(optionForm);
    } else {
        alert("Each question must have at least 2 options");
    }
}

// Function to remove a question
function removeQuestion(button) {
    const questionForm = button.closest('.question-form');

    if (document.querySelectorAll('.question-form').length > 1) {
        document.getElementById('questions-container').removeChild(questionForm);
    }
    else{
        alert("At least one question is required.");
        
    }
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
        
        let questionsHTML = '';
        quiz.questions.forEach((question, qIndex) => {
            let optionsHTML = '';
            question.options.forEach((option, oIndex) => {
                optionsHTML += `
                    <div class="option ${option.correct ? 'correct' : ''}">
                        <input type="radio" id="q${quiz.id}-${qIndex}-${oIndex}" name="q${quiz.id}-${qIndex}" ${option.correct ? 'checked' : ''} disabled>
                        <label for="q${quiz.id}-${qIndex}-${oIndex}" class="option-text">${option.text}</label>
                    </div>
                `;
            });
            
            questionsHTML += `
                <div class="question-card">
                    <div class="question-text">${qIndex + 1}. ${question.text}</div>
                    <div class="options-container">
                        ${optionsHTML}
                    </div>
                </div>
            `;
        });
        
        quizCard.innerHTML = `
            <h2 class="quiz-title">${quiz.title}</h2>
            <p class="quiz-description">${quiz.description}</p>
            ${questionsHTML}
            <div class="quiz-actions">
                <button class="quiz-btn edit-btn" onclick="editQuiz(${quiz.id})">
                    <i class="fa-solid fa-edit"></i> Edit
                </button>
            </div>
        `;
        
        quizzesContainer.appendChild(quizCard);
    });
}

// Function to edit a quiz
// function editQuiz(quizId) {
//     const quiz = quizzes.find(q => q.id === quizId);
//     if (!quiz) return;
    
//     // Populate the form with quiz data
//     document.getElementById('quiz-title').value = quiz.title;
//     document.getElementById('quiz-description').value = quiz.description;
    
//     // Clear existing questions
//     document.getElementById('questions-container').innerHTML = '';
    
//     // Add each question
//     quiz.questions.forEach((question, qIndex) => {
//         const questionForm = document.createElement('div');
//         questionForm.classList.add('question-form');
        
//         let optionsHTML = '';
//         question.options.forEach((option, oIndex) => {
//             optionsHTML += `
//                 <div class="option-form">
//                     <input type="radio" name="correct-${qIndex}" ${option.correct ? 'checked' : ''}>
//                     <input type="text" value="${option.text}" required>
//                     <button type="button" class="remove-btn" onclick="removeOption(this)">
//                         <i class="fa-solid fa-times"></i>
//                     </button>
//                 </div>
//             `;
//         });
        
//         questionForm.innerHTML = `
//             <div class="form-group">
//                 <label for="question-${qIndex}">Question ${qIndex + 1}</label>
//                 <input type="text" id="question-${qIndex}" value="${question.text}" required>
//                 <button type="button" class="remove-question-btn" onclick="removeQuestion(this)">
//                     <i class="fa-solid fa-trash"></i> Remove Question
//                 </button>
//             </div>
            
//             <div class="options-container" id="options-container-${qIndex}">
//                 ${optionsHTML}
//             </div>
            
//             <button type="button" class="add-option-btn" onclick="addOption(${qIndex})">
//                 <i class="fa-solid fa-plus"></i> Add Option
//             </button>
//         `;
        
//         document.getElementById('questions-container').appendChild(questionForm);
//     });
    
//     // Open the popup
//     openQuizPopup();
// }



//Handle form submission
document.getElementById('quiz-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;
    
    const questions = [];
    const questionForms = document.querySelectorAll('.question-form');
    
    questionForms.forEach((qForm, qIndex) => {
        const questionText = qForm.querySelector(`#question-${qIndex}`).value;
        const options = [];
        
        const optionForms = qForm.querySelectorAll('.option-form');
        optionForms.forEach((oForm) => {
            const optionText = oForm.querySelector('input[type="text"]').value;
            const isCorrect = oForm.querySelector('input[type="radio"]').checked;
            
            options.push({
                text: optionText,
                correct: isCorrect
            });
        });
        
        questions.push({
            text: questionText,
            options: options
        });
    });
    // Create new quiz or update existing
    const data = {
        course_id: '123e4567-e89b-12d3-a456-426614174111', // TODO: Retrive the courseId from the session storage 
        title,
        description,
        questions
    };
    console.log("Quiz data to be sent:", data);
    try {
        const response = await fetch("/addQuiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log("Quiz added successfully:", result);
            getQuizzes();
            closeQuizPopup();
        } else {
            console.error("Failed to add quiz:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding quiz:", error);
    }

    
    
});

document.addEventListener('DOMContentLoaded', getQuizzes);

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {

    
    // Quiz popup listeners
    document.getElementById("new-quiz-btn").addEventListener("click", function() {
        // Reset form and open popup
        document.getElementById("quiz-form").reset();
        document.getElementById("questions-container").innerHTML = "";
        addQuestionForm(); // Add an initial empty question
        openQuizPopup();
    });
    
    document.getElementById("close-popup").addEventListener("click", closeQuizPopup);
    document.getElementById("cancel-btn").addEventListener("click", closeQuizPopup);
    document.getElementById("quiz-overlay").addEventListener("click", function(e) {
        if (e.target === this) {
            closeQuizPopup();
        }
    });
    
    document.getElementById("add-question-btn").addEventListener("click", addQuestionForm);
    
});