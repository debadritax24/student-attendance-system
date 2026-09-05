const params =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    Number(
        params.get("id")
    );


const student =
    students.find(
        item =>
            item.id === studentId
    );


if (student) {

    document.getElementById(
        "studentName"
    ).textContent =
        student.name;


    document.getElementById(
        "profileName"
    ).textContent =
        student.name;


    document.getElementById(
        "profileEmail"
    ).textContent =
        student.email;


    document.getElementById(
        "studentInfo"
    ).textContent =
        `${student.roll} | ${student.department} | Semester ${student.semester} | Section ${student.section}`;


    document.getElementById(
        "overallAttendance"
    ).textContent =
        student.attendance + "%";


    document.getElementById(
        "studentAvatar"
    ).textContent =
        getInitials(student.name);


    if (student.attendance < 75) {

        document.getElementById(
            "attendanceWarning"
        ).style.display = "block";

    }


    if (window.Chart) {
        new Chart(

        document.getElementById(
            "studentChart"
        ),

        {

            type: "line",

            data: {

                labels: [
                    "Week 1",
                    "Week 2",
                    "Week 3",
                    "Week 4",
                    "Week 5",
                    "Week 6"
                ],

                datasets: [{

                    label:
                        "Attendance %",

                    data: [
                        82,
                        80,
                        78,
                        76,
                        student.attendance,
                        student.attendance
                    ],

                    tension: 0.4

                }]

            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        min: 0,
                        max: 100
                    }
                }
            }

        }

        );
    }

}


setUserInfo();
