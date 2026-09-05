function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function openModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
    }
}

function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }
}

function logout() {

    localStorage.removeItem("attendifyUser");

    window.location.href = "login.html";
}

function getCurrentUser() {
    const savedUser = localStorage.getItem("attendifyUser");
    return savedUser ? JSON.parse(savedUser) : currentUser;
}

function currentUserRole() {
    return (getCurrentUser().role || "CR").toUpperCase();
}

function hasRole(...roles) {
    return roles.map(role => role.toUpperCase()).includes(currentUserRole());
}

function canManageAttendance() {
    return hasRole("CR", "ADMIN");
}

function canManageStudents() {
    return hasRole("ADMIN");
}

function canViewStudentDetails() {
    return hasRole("CR", "ADMIN", "STUDENT");
}

function applyRoleAccess() {
    const role = currentUserRole();

    document.querySelectorAll("[data-role-admin]").forEach(element => {
        element.style.display = role === "ADMIN" ? "" : "none";
    });

    document.querySelectorAll("[data-role-cr]").forEach(element => {
        element.style.display = role === "CR" ? "" : "none";
    });

    document.querySelectorAll("[data-role-student]").forEach(element => {
        element.style.display = role === "STUDENT" ? "" : "none";
    });

    document.querySelectorAll("[data-role-editable]").forEach(element => {
        const editable = role === "CR" || role === "ADMIN";
        element.style.display = editable ? "" : "none";
    });
}

function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function setUserInfo() {

    const user =
        JSON.parse(
            localStorage.getItem("attendifyUser")
        ) || currentUser;

    const nameElements =
        document.querySelectorAll("[data-user-name]");

    const roleElements =
        document.querySelectorAll("[data-user-role]");

    nameElements.forEach(element => {
        element.textContent = user.name;
    });

    roleElements.forEach(element => {
        element.textContent = user.role;
    });
}
