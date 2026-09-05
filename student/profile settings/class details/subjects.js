let subjectList = [...subjects];


const grid =
    document.getElementById(
        "subjectGrid"
    );


function renderSubjects() {

    const search =
        document
            .getElementById("subjectSearch")
            .value
            .toLowerCase();


    const filtered =
        subjectList.filter(subject =>

            subject.name
                .toLowerCase()
                .includes(search)

            ||

            subject.code
                .toLowerCase()
                .includes(search)

        );


    grid.innerHTML = "";


    if (filtered.length === 0) {

        grid.innerHTML = `
            <div class="card">

                <h3>No subjects found</h3>

                <p style="color:#64748b">
                    Try another search.
                </p>

            </div>
        `;

        return;
    }


    filtered.forEach(subject => {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
            ">

                <div>

                    <span class="badge badge-primary">
                        ${subject.code}
                    </span>

                    <h2 style="margin-top:12px">
                        ${subject.name}
                    </h2>

                    <p style="
                        color:#64748b;
                        margin-top:5px;
                    ">

                        ${subject.faculty}

                    </p>

                </div>

                <button
                    class="btn btn-danger"
                    onclick="deleteSubject(${subject.id})">

                    Delete

                </button>

            </div>


            <div style="
                display:grid;
                grid-template-columns:
                    repeat(3,1fr);
                gap:10px;
                margin-top:20px;
            ">

                <div>

                    <small
                        style="color:#64748b">
                        Semester
                    </small>

                    <strong
                        style="display:block">

                        ${subject.semester}

                    </strong>

                </div>


                <div>

                    <small
                        style="color:#64748b">
                        Section
                    </small>

                    <strong
                        style="display:block">

                        ${subject.section}

                    </strong>

                </div>


                <div>

                    <small
                        style="color:#64748b">
                        Classes
                    </small>

                    <strong
                        style="display:block">

                        ${subject.classes}

                    </strong>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


function deleteSubject(id) {

    const subject =
        subjectList.find(
            item => item.id === id
        );


    if (!subject) return;


    if (
        !confirm(
            `Delete ${subject.name}?`
        )
    ) {
        return;
    }


    subjectList =
        subjectList.filter(
            item => item.id !== id
        );


    renderSubjects();

    showToast(
        "Subject deleted successfully"
    );

}


document
    .getElementById("subjectSearch")
    .addEventListener(
        "input",
        renderSubjects
    );


document
    .getElementById("subjectForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            subjectList.push({

                id: Date.now(),

                name:
                    document
                        .getElementById(
                            "subjectName"
                        )
                        .value,

                code:
                    document
                        .getElementById(
                            "subjectCode"
                        )
                        .value,

                faculty:
                    document
                        .getElementById(
                            "subjectFaculty"
                        )
                        .value,

                semester: 5,

                section: "A",

                classes: 0

            });


            renderSubjects();

            closeModal("subjectModal");

            this.reset();


            showToast(
                "Subject added successfully"
            );

        }
    );


setUserInfo();

renderSubjects();
