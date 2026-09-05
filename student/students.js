let studentList = [...students];

const table =
    document.getElementById("studentsTable");

function getVisibleStudents() {
    const currentUser = getCurrentUser();
    const role = currentUserRole();

    if (role === "STUDENT") {
        const student = students.find(item => item.email === currentUser.email);
        return student ? [student] : [];
    }

    return studentList;
}

function renderStudents() {

    const search =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase();

    const department =
        document
            .getElementById("departmentFilter")
            .value;

    const semester =
        document
            .getElementById("semesterFilter")
            .value;

    const section =
        document
            .getElementById("sectionFilter")
            .value;


    const visibleStudents = getVisibleStudents();

    const filteredStudents =
        visibleStudents.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search)
                ||
                student.roll
                    .toLowerCase()
                    .includes(search);


            const matchesDepartment =
                !department ||
                student.department === department;


            const matchesSemester =
                !semester ||
                String(student.semester) === semester;


            const matchesSection =
                !section ||
                student.section === section;


            return (
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesSection
            );

        });


    table.innerHTML = "";


    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:40px">

                    No students found.

                </td>
            </tr>
        `;

        return;
    }


    filteredStudents.forEach(student => {

        const status =
            student.attendance >= 75
                ? "Good"
                : "Warning";


        const badge =
            student.attendance >= 75
                ? "badge-present"
                : "badge-warning";


        const row =
            document.createElement("tr");


        const canDelete = canManageStudents();
        const role = currentUserRole();
        const actionsHtml = role === "STUDENT"
            ? '<button class="btn btn-secondary" onclick="viewStudent('+student.id+')">View</button>'
            : `
                <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary" onclick="viewStudent(${student.id})">View</button>
                    <button class="btn btn-secondary" onclick="editStudent(${student.id})">Edit</button>
                    ${canDelete ? `<button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>` : ""}
                </div>
            `;

        row.innerHTML = `

            <td>
                <strong>${student.roll}</strong>
            </td>

            <td>

                <div class="user">

                    <div class="avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>
                        <strong>${student.name}</strong>

                        <small style="display:block;color:#64748b">
                            ${student.email}
                        </small>
                    </div>

                </div>

            </td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>${student.section}</td>

            <td>

                <strong>
                    ${student.attendance}%
                </strong>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${student.attendance}%">
                    </div>

                </div>

            </td>

            <td>

                <span class="badge ${badge}">
                    ${status}
                </span>

            </td>

            <td>
                ${actionsHtml}
            </td>

        `;


        table.appendChild(row);

    });

}


function updateStatistics() {

    const total =
        studentList.length;


    const average =
        total
            ? Math.round(
                studentList.reduce(
                    (sum, student) =>
                        sum + student.attendance,
                    0
                ) / total
            )
            : 0;


    const above =
        studentList.filter(
            student =>
                student.attendance >= 75
        ).length;


    const below =
        total - above;


    document.getElementById(
        "studentTotal"
    ).textContent = total;


    document.getElementById(
        "averageAttendance"
    ).textContent =
        average + "%";


    document.getElementById(
        "aboveAttendance"
    ).textContent = above;


    document.getElementById(
        "belowAttendance"
    ).textContent = below;

}


function viewStudent(id) {

    window.location.href =
        `student-details.html?id=${id}`;

}


function editStudent(id) {
    const student = studentList.find(item => item.id === id) || students.find(item => item.id === id);
    if (!student) return;

    const form = document.getElementById("editStudentForm");
    if (!form) return;

    form.dataset.studentId = id;
    document.getElementById("editStudentName").value = student.name;
    document.getElementById("editStudentEmail").value = student.email;
    document.getElementById("editStudentDepartment").value = student.department;
    document.getElementById("editStudentSemester").value = student.semester;
    document.getElementById("editStudentSection").value = student.section;

    openModal("editStudentModal");
}

function deleteStudent(id) {

    const student =
        studentList.find(
            student =>
                student.id === id
        );


    if (!student) return;


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) return;


    studentList =
        studentList.filter(
            student =>
                student.id !== id
        );


    renderStudents();
    updateStatistics();

    showToast(
        "Student deleted successfully"
    );

}


document
    .getElementById("editStudentForm")
    .addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const studentId = Number(this.dataset.studentId);
            const student = studentList.find(item => item.id === studentId) || students.find(item => item.id === studentId);

            if (!student) return;

            student.name = document.getElementById("editStudentName").value.trim();
            student.email = document.getElementById("editStudentEmail").value.trim();
            student.department = document.getElementById("editStudentDepartment").value;
            student.semester = Number(document.getElementById("editStudentSemester").value);
            student.section = document.getElementById("editStudentSection").value;

            renderStudents();
            updateStatistics();
            closeModal("editStudentModal");
            showToast("Student details updated successfully");
        }
    );

document
    .getElementById("studentForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const newStudent = {

                id:
                    Date.now(),

                name:
                    document
                        .getElementById("studentName")
                        .value,

                roll:
                    document
                        .getElementById("studentRoll")
                        .value,

                email:
                    document
                        .getElementById("studentEmail")
                        .value,

                department:
                    document
                        .getElementById("studentDepartment")
                        .value,

                semester:
                    Number(
                        document
                            .getElementById("studentSemester")
                            .value
                    ),

                section:
                    document
                        .getElementById("studentSection")
                        .value,

                attendance: 100

            };


            studentList.push(newStudent);


            renderStudents();
            updateStatistics();


            document
                .getElementById("studentForm")
                .reset();


            closeModal("studentModal");


            showToast(
                "Student added successfully"
            );

        }
    );


document
    .getElementById("studentSearch")
    .addEventListener(
        "input",
        renderStudents
    );


document
    .getElementById("departmentFilter")
    .addEventListener(
        "change",
        renderStudents
    );


document
    .getElementById("semesterFilter")
    .addEventListener(
        "change",
        renderStudents
    );


document
    .getElementById("sectionFilter")
    .addEventListener(
        "change",
        renderStudents
    );


const addStudentButton = document.querySelector("[data-add-student]");
if (addStudentButton) {
    addStudentButton.style.display = canManageStudents() ? "" : "none";
}

setUserInfo();
applyRoleAccess();
renderStudents();
updateStatistics();
