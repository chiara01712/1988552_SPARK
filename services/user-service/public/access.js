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
    

function redirectToIndex() {
    window.location.href = "/index";
}
document.addEventListener("DOMContentLoaded", function () {
    const role = sessionStorage.getItem("userRole");
    if (role) {
        document.getElementById("roleTitle").innerText = `Hello,`+` ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        
        // Aggiungi un campo nascosto al form di registrazione
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "role";
        input.value = role;
        document.querySelector(".form-container.sign-up form").appendChild(input);
    }
});