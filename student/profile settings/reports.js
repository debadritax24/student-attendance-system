setUserInfo();

if (window.Chart) new Chart(
    document.getElementById("subjectAttendanceChart"),
    {
        type: "bar",

        data: {
            labels: [
                "Data Structures",
                "DBMS",
                "Operating Systems",
                "Computer Networks"
            ],

            datasets: [{
                label: "Attendance %",
                data: [91, 87, 84, 93]
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    }
);


if (window.Chart) new Chart(
    document.getElementById("presentAbsentChart"),
    {
        type: "doughnut",

        data: {
            labels: [
                "Present",
                "Absent"
            ],

            datasets: [{
                data: [
                    86,
                    14
                ]
            }]
        },

        options: {
            responsive: true
        }
    }
);


if (window.Chart) new Chart(
    document.getElementById("attendanceTrendChart"),
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
                label: "Attendance %",
                data: [
                    81,
                    83,
                    82,
                    85,
                    87,
                    86
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
