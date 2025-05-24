function redirectToIndex() {
    window.location.href = "/index";
}
document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
 
    // Show the sign-up form when the "Sign Up" button is clicked
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    // Show the login form when the "Login" button is clicked
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Redirects the user to the sign-up page with the specified role as a query parameter
    const role = sessionStorage.getItem("userRole");
    if (role) {
        console.log("Role from session storage:", role);
        document.getElementById("roleTitle").innerText = `Hello,`+` ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        
        // Add a hidden input field to the form with the role value
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "role";
        input.value = role;
        document.querySelector(".form-container.sign-up form").appendChild(input);
    }
    else{
        console.log("No role found in session storage.");
    
    }

    // POST request for login 
    const loginForm = document.getElementById("login-form");
    if(loginForm){
        console.log("loginForm",loginForm);
        loginForm.addEventListener("submit", async (event)=> {
            event.preventDefault(); // Prevent the default form submission

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const data = {
                email: email,
                password: password,
            };

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    // credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                

                if (response.status === 200) {
                    const result = await response.json();

                    console.log("Login successful:", result);
                    console.log("Cookies: ",document.cookie);

                    //if role is student
                    if(sessionStorage.getItem("userRole") === "student"){
                        // Redirect to the home page of the student-service
                        window.location.href = "http://localhost:7070/home";
                    }
                    //if role is teacher
                    else if(sessionStorage.getItem("userRole") === "teacher"){
                        // Redirect to the home page of the teacher
                        window.location.href = "http://localhost:6060/home";
                    }
                } else {
                    const errorText = await response.text();
                    console.error("Login failed:", errorText);
                    alert(errorText);
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert(errorText);
            }

            


        });
    }
});