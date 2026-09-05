const historyData = [

    {
        date: "2026-09-05",
        subject: "Data Structures",
        period: "1st Period",
        present: 108,
        absent: 12,
        percentage: 90,
        markedBy: "Debadrita Goswami"
    },

    {
        date: "2026-09-04",
        subject: "Database Management",
        period: "2nd Period",
        present: 104,
        absent: 16,
        percentage: 87,
        markedBy: "Debadrita Goswami"
    },

    {
        date: "2026-09-03",
        subject: "Operating Systems",
        period: "3rd Period",
        present: 98,
        absent: 22,
        percentage: 82,
        markedBy: "Debadrita Goswami"
    },

    {
        date: "2026-09-02",
        subject: "Computer Networks",
        period: "1st Period",
        present: 112,
        absent: 8,
        percentage: 93,
        markedBy: "Debadrita Goswami"
    }

];


function renderHistory() {

    const search =
        document
            .getElementById("historySearch")
            .value
            .toLowerCase();

    const subject =
        document
            .getElementById("historySubject")
            .value;

    const date =
        document
            .getElementById("historyDate")
            .value;


    const filtered =
        historyData.filter(record => {

            const matchesSearch =
                record.subject
                    .toLowerCase()
                    .includes(search);

            const matchesSubject =
                !subject ||
                record.subject === subject;

            const matchesDate =
                !date ||
                record.date === date;

            return (
                matchesSearch &&
                matchesSubject &&
                matchesDate
            );
        });


    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:40px">

                    No attendance records found.

                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(record => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${record.date}</td>

            <td>
                <strong>
                    ${record.subject}
                </strong>
            </td>

            <td>${record.period}</td>

            <td>
                <span class="badge badge-present">
                    ${record.present}
                </span>
            </td>

            <td>
                <span class="badge badge-absent">
                    ${record.absent}
                </span>
            </td>

            <td>
                <strong>
                    ${record.percentage}%
                </strong>
            </td>

            <td>${record.markedBy}</td>

            <td>

                <button
                    class="btn btn-secondary"
                    onclick="viewRecord('${record.date}')">

                    View

                </button>

            </td>
        `;

        table.appendChild(row);

    });

}


function viewRecord(date) {

    const record =
        historyData.find(
            item => item.date === date
        );

    if (!record) return;

    alert(
        `${record.subject}\n` +
        `${record.date} - ${record.period}\n\n` +
        `Present: ${record.present}\n` +
        `Absent: ${record.absent}\n` +
        `Attendance: ${record.percentage}%`
    );

}


document
    .getElementById("historySearch")
    .addEventListener(
        "input",
        renderHistory
    );


document
    .getElementById("historySubject")
    .addEventListener(
        "change",
        renderHistory
    );


document
    .getElementById("historyDate")
    .addEventListener(
        "change",
        renderHistory
    );


setUserInfo();

renderHistory();
