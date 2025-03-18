const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Redirects the user to the sign-up page with the specified role as a query parameter
    
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role) {
        document.getElementById("roleTitle").innerText = `Hello,`+` ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    }
};
function redirectToIndex() {
    window.location.href = "index.html";
}