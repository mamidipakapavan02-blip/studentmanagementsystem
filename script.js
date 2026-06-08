// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const user = {
            email,
            username,
            password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Registration Successful");

        window.location.href = "login.html";
    });
}

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user =
            JSON.parse(localStorage.getItem("user"));

        if (
            user &&
            user.email === email &&
            user.password === password
        ) {
            localStorage.setItem(
                "loggedIn",
                "true"
            );

            alert("Login Successful");

            window.location.href =
                "dashboard.html";
        } else {
            alert("Invalid Email or Password");
        }
    });
}

// ================= ADD STUDENT =================

const addStudentForm =
    document.getElementById("addStudentForm");

if (addStudentForm) {
    addStudentForm.addEventListener(
        "submit",
        function (e) {
            e.preventDefault();

            const student = {
                id: Date.now(),
                name:
                    document.getElementById("name")
                        .value,
                rollno:
                    document.getElementById("rollno")
                        .value,
                branch:
                    document.getElementById("branch")
                        .value,
                cgpa:
                    document.getElementById("cgpa")
                        .value
            };

            let students =
                JSON.parse(
                    localStorage.getItem("students")
                ) || [];

            students.push(student);

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            alert("Student Added Successfully");

            window.location.href =
                "viewstudent.html";
        }
    );
}

// ================= VIEW STUDENTS =================

const studentTableBody =
    document.getElementById(
        "studentTableBody"
    );

if (studentTableBody) {
    displayStudents();
}

function displayStudents() {
    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];

    studentTableBody.innerHTML = "";

    if (students.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No Students Found
                </td>
            </tr>
        `;
        return;
    }

    students.forEach((student) => {
        studentTableBody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.rollno}</td>
                <td>${student.branch}</td>
                <td>${student.cgpa}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>

                </td>
            </tr>
        `;
    });
}

// ================= DELETE STUDENT =================

function deleteStudent(id) {
    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];

    students = students.filter(
        (student) => student.id !== id
    );

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    alert("Student Deleted Successfully");

    displayStudents();
}

// ================= EDIT STUDENT =================

function editStudent(id) {
    localStorage.setItem("editId", id);

    window.location.href =
        "editstudent.html";
}

const editStudentForm =
    document.getElementById(
        "editStudentForm"
    );

if (editStudentForm) {
    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];

    const editId = Number(
        localStorage.getItem("editId")
    );

    const student = students.find(
        (s) => s.id === editId
    );

    if (student) {
        document.getElementById("name").value =
            student.name;

        document.getElementById("rollno").value =
            student.rollno;

        document.getElementById("branch").value =
            student.branch;

        document.getElementById("cgpa").value =
            student.cgpa;
    }

    editStudentForm.addEventListener(
        "submit",
        function (e) {
            e.preventDefault();

            const index =
                students.findIndex(
                    (s) => s.id === editId
                );

            students[index] = {
                id: editId,
                name:
                    document.getElementById(
                        "name"
                    ).value,

                rollno:
                    document.getElementById(
                        "rollno"
                    ).value,

                branch:
                    document.getElementById(
                        "branch"
                    ).value,

                cgpa:
                    document.getElementById(
                        "cgpa"
                    ).value
            };

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            alert(
                "Student Updated Successfully"
            );

            window.location.href =
                "viewstudent.html";
        }
    );
}

// ================= LOGOUT =================

if (
    window.location.pathname.includes(
        "logout.html"
    )
) {
    localStorage.removeItem("loggedIn");
}

// ================= PAGE PROTECTION =================

const protectedPages = [
    "dashboard.html",
    "addstudent.html",
    "viewstudent.html",
    "editstudent.html"
];

const currentPage =
    window.location.pathname
        .split("/")
        .pop();

if (
    protectedPages.includes(
        currentPage
    ) &&
    localStorage.getItem(
        "loggedIn"
    ) !== "true"
) {
    alert("Please Login First");

    window.location.href =
        "login.html";
}