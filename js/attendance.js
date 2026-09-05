let attendanceState = [...attendance];

const table =
    document.getElementById("attendanceTable");

function renderAttendance(list = students) {

    table.innerHTML = "";

    list.forEach(student => {

        const record =
            attendanceState.find(
                item =>
                    item.studentId === student.id
            );

        const row =
            document.createElement("tr");

        const canEdit = canManageAttendance();
        const statusCell = canEdit ? `
            <div class="attendance-buttons">
                <button
                    class="attendance-btn present
                    ${record.status === "Present"
                        ? "selected"
                        : ""}"

                    onclick="setStatus(
                        ${student.id},
                        'Present'
                    )">

                    Present

                </button>

                <button
                    class="attendance-btn absent
                    ${record.status === "Absent"
                        ? "selected"
                        : ""}"

                    onclick="setStatus(
                        ${student.id},
                        'Absent'
                    )">

                    Absent

                </button>
            </div>
        ` : `<span class="badge ${record.status === 'Present' ? 'badge-present' : 'badge-warning'}">${record.status || 'Absent'}</span>`;

        row.innerHTML = `

            <td>${student.roll}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>${student.attendance}%</td>

            <td>${statusCell}</td>

        `;

        table.appendChild(row);

    });

    updateStats();
}

function setStatus(id, status) {

    const record =
        attendanceState.find(
            item =>
                item.studentId === id
        );

    if (record) {
        record.status = status;
    }

    renderAttendance();
}

function markAllPresent() {

    attendanceState.forEach(
        record => {
            record.status = "Present";
        }
    );

    renderAttendance();

    showToast(
        "All students marked present"
    );
}

function updateStats() {

    const total =
        attendanceState.length;

    const present =
        attendanceState.filter(
            item =>
                item.status === "Present"
        ).length;

    const absent =
        total - present;

    const percentage =
        total
            ? Math.round((present / total) * 100)
            : 0;

    document.getElementById(
        "totalStudents"
    ).textContent = total;

    document.getElementById(
        "presentCount"
    ).textContent = present;

    document.getElementById(
        "absentCount"
    ).textContent = absent;

    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";
}

function saveAttendance() {

    showToast(
        "Attendance saved successfully!"
    );
}

const role = currentUserRole();
if (role === "STUDENT") {
    const markAllBtn = document.querySelector("button[onclick='markAllPresent()']");
    if (markAllBtn) markAllBtn.style.display = "none";
    const saveBtn = document.querySelector("button[onclick='saveAttendance()']");
    if (saveBtn) saveBtn.style.display = "none";
}

document
    .getElementById("studentSearch")
    .addEventListener(
        "input",
        function() {

            const search =
                this.value.toLowerCase();

            const filtered =
                students.filter(student =>
                    student.name
                        .toLowerCase()
                        .includes(search)
                    ||
                    student.roll
                        .toLowerCase()
                        .includes(search)
                );

            renderAttendance(filtered);
        }
    );

renderAttendance();
setUserInfo();
