// ================= REGEX PATTERNS =================

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

const usernameRegex =
    /^[A-Za-z ]{3,20}$/;


// ================= REGISTER =================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const username =
                document.getElementById("username").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const emailError =
                document.getElementById("emailError");

            const passwordError =
                document.getElementById("passwordError");

            const confirmError =
                document.getElementById("confirmError");

            emailError.innerText = "";
            passwordError.innerText = "";
            confirmError.innerText = "";

            if (!emailRegex.test(email)) {

                emailError.innerText =
                    "Enter a valid email address";

                return;
            }

            if (!usernameRegex.test(username)) {

                alert(
                    "Username must contain only letters and be 3-20 characters long"
                );

                return;
            }

            if (!passwordRegex.test(password)) {

                passwordError.innerText =
                    "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";

                return;
            }

            if (password !== confirmPassword) {

                confirmError.innerText =
                    "Passwords do not match";

                return;
            }

            let users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const userExists =
                users.some(
                    user => user.email === email
                );

            if (userExists) {

                emailError.innerText =
                    "Email already registered";

                return;
            }

            users.push({
                email,
                username,
                password
            });

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            alert(
                "Registration Successful"
            );

            window.location.href =
                "login.html";
        }
    );
}


// ================= LOGIN =================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const emailError =
                document.getElementById("emailError");

            const passwordError =
                document.getElementById("passwordError");

            emailError.innerText = "";
            passwordError.innerText = "";

            if (!emailRegex.test(email)) {

                emailError.innerText =
                    "Invalid Email Format";

                return;
            }

            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const validUser =
                users.find(
                    user =>
                        user.email === email &&
                        user.password === password
                );

            if (validUser) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(validUser)
                );

                alert(
                    "Login Successful"
                );

                window.location.href =
                    "dashboard.html";
            }
            else {

                passwordError.innerText =
                    "Invalid Email or Password";
            }
        }
    );
}


// ================= ADD STUDENT =================

const addStudentForm =
    document.getElementById(
        "addStudentForm"
    );

if (addStudentForm) {

    addStudentForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const name =
                document.getElementById("name")
                    .value.trim();

            const rollno =
                document.getElementById("rollno")
                    .value.trim();

            const branch =
                document.getElementById("branch")
                    .value.trim();

            const cgpa =
                parseFloat(
                    document.getElementById("cgpa")
                        .value
                );

            if (
                cgpa < 0 ||
                cgpa > 10
            ) {

                alert(
                    "CGPA must be between 0 and 10"
                );

                return;
            }

            const student = {
                id: Date.now(),
                name,
                rollno,
                branch,
                cgpa
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

            alert(
                "Student Added Successfully"
            );

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

    students.forEach(student => {

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

    students =
        students.filter(
            student =>
                student.id !== id
        );

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    alert(
        "Student Deleted Successfully"
    );

    displayStudents();
}


// ================= EDIT STUDENT =================

function editStudent(id) {

    localStorage.setItem(
        "editId",
        id
    );

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

    const editId =
        Number(
            localStorage.getItem("editId")
        );

    const student =
        students.find(
            s => s.id === editId
        );

    if (student) {

        document.getElementById("name")
            .value = student.name;

        document.getElementById("rollno")
            .value = student.rollno;

        document.getElementById("branch")
            .value = student.branch;

        document.getElementById("cgpa")
            .value = student.cgpa;
    }

    editStudentForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const cgpa =
                parseFloat(
                    document.getElementById("cgpa")
                        .value
                );

            if (
                cgpa < 0 ||
                cgpa > 10
            ) {

                alert(
                    "CGPA must be between 0 and 10"
                );

                return;
            }

            const index =
                students.findIndex(
                    s => s.id === editId
                );

            students[index] = {

                id: editId,

                name:
                    document.getElementById("name")
                        .value,

                rollno:
                    document.getElementById("rollno")
                        .value,

                branch:
                    document.getElementById("branch")
                        .value,

                cgpa
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

    localStorage.removeItem(
        "loggedIn"
    );

    localStorage.removeItem(
        "currentUser"
    );
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

    alert(
        "Please Login First"
    );

    window.location.href =
        "login.html";
}