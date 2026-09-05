const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

const API_BASE = "http://localhost:3001";

function setLoggedInUser(user, redirectPage) {
    localStorage.setItem("attendifyUser", JSON.stringify(user));
    window.location.href = redirectPage;
}

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const passwordValue = document.getElementById("password").value.trim();

        if (!email || !passwordValue) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password: passwordValue })
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || "Login failed");
            }

            const user = payload.data;
            const redirectPage = user.role === "STUDENT" ? "students.html" : "dashboard.html";
            setLoggedInUser(user, redirectPage);
        } catch (error) {
            alert(error.message || "Login failed. Check your credentials and try again.");
        }
    });
}
