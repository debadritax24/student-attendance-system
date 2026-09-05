const students = [
    {
        id: 1,
        roll: "AU001",
        name: "Aarav Sharma",
        email: "aarav@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 92
    },
    {
        id: 2,
        roll: "AU002",
        name: "Riya Das",
        email: "riya@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 88
    },
    {
        id: 3,
        roll: "AU003",
        name: "Aditya Roy",
        email: "aditya@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 72
    },
    {
        id: 4,
        roll: "AU004",
        name: "Sneha Paul",
        email: "sneha@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 81
    },
    {
        id: 5,
        roll: "AU005",
        name: "Rahul Sen",
        email: "rahul@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 69
    },
    {
        id: 6,
        roll: "AU006",
        name: "Ananya Roy",
        email: "ananya@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 95
    },
    {
        id: 7,
        roll: "AU007",
        name: "Soham Das",
        email: "soham@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 84
    },
    {
        id: 8,
        roll: "AU008",
        name: "Priya Sharma",
        email: "priya@example.com",
        department: "CSE",
        semester: 5,
        section: "A",
        attendance: 76
    }
];

const subjects = [
    {
        id: 1,
        name: "Data Structures",
        code: "CS501",
        faculty: "Dr. Ankit Sen",
        semester: 5,
        section: "A",
        classes: 42
    },
    {
        id: 2,
        name: "Database Management",
        code: "CS502",
        faculty: "Dr. Priya Roy",
        semester: 5,
        section: "A",
        classes: 38
    },
    {
        id: 3,
        name: "Operating Systems",
        code: "CS503",
        faculty: "Dr. Rahul Das",
        semester: 5,
        section: "A",
        classes: 40
    },
    {
        id: 4,
        name: "Computer Networks",
        code: "CS504",
        faculty: "Dr. Sneha Paul",
        semester: 5,
        section: "A",
        classes: 36
    }
];

const attendance = students.map((student, index) => ({
    studentId: student.id,
    status: index === 2 || index === 4 ? "Absent" : "Present"
}));

const currentUser = {
    name: "Debadrita Goswami",
    role: "CR",
    email: "cr@attendify.com"
};