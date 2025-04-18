// Menu functionality
function open_Menu() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("overlaybar").classList.add("overlayactive");
}

function close_Menu() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("overlaybar").classList.remove("overlayactive");
}

function open_Profile() {
    document.getElementById("profileSidebar").style.display = "block";
    document.getElementById("overlaysidebar").classList.add("overlayactive");
}

function close_Profile() {
    document.getElementById("profileSidebar").style.display = "none";
    document.getElementById("overlaysidebar").classList.remove("overlayactive");
}

// Add event listeners
document.getElementById("menu").addEventListener("click", open_Menu);
document.getElementById("profile").addEventListener("click", open_Profile);
document.getElementById("overlaybar").addEventListener("click", close_Menu);
document.getElementById("overlaysidebar").addEventListener("click", close_Profile);

//To change the profile image based on the role
const role = sessionStorage.getItem("userRole");
const profileImage = document.getElementById("profileImage");

if (role == "student") {
    profileImage.src = "student.png";
} else if (role == "teacher") {
    profileImage.src = "Professor.png";
} 

function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchUserData() {
    const userId = getCookie("user_Id");
    console.log("User ID from cookie:", userId);
    try {
        const response = await fetch('/userData', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'user_id': userId,
            },
        });
        if (response.status === 200) {
            const userData = await response.json();
            console.log("User data fetched successfully:", userData);
            const dataContainer = document.getElementById('personalInfo');
            dataContainer.innerHTML = ''; // Clear previous content

            const userInfoHtml = `
                <div class="info-item">
                    <div class="info-label">Username:</div>
                    <div class="info-value">${userData.username}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email:</div>
                    <div class="info-value">${userData.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Role:</div>
                    <div class="info-value">${userData.role}</div>
                </div>
            `;
            dataContainer.innerHTML = userInfoHtml;

        } else {
            console.error('Failed to fetch user data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchUserData);

