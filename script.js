// =====================================================
// REGEX PATTERNS
// =====================================================

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

const usernameRegex =
    /^[A-Za-z ]{3,20}$/;


// =====================================================
// REGISTER USER
// =====================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

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

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/users"
                    );

                const users =
                    await response.json();

                const userExists =
                    users.some(
                        user => user.email === email
                    );

                if (userExists) {

                    emailError.innerText =
                        "Email already registered";

                    return;
                }

                const userData = {
                    email,
                    username,
                    password
                };

                const res =
                    await fetch(
                        "http://localhost:3000/users",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(userData)
                        }
                    );

                if (!res.ok) {

                    alert(
                        "Registration Failed"
                    );

                    return;
                }

                alert(
                    "Registration Successful"
                );

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(error);

                alert(
                    "Server Error"
                );
            }
        }
    );
}


// =====================================================
// LOGIN USER
// =====================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

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

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/users"
                    );

                const users =
                    await response.json();

                const validUser =
                    users.find(
                        user =>
                            user.email === email &&
                            user.password === password
                    );

                if (validUser) {

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

            } catch (error) {

                console.error(error);

                alert(
                    "Server Error"
                );
            }
        }
    );
}


// =====================================================
// ADD STUDENT
// =====================================================

const addStudentForm =
    document.getElementById("addStudentForm");

if (addStudentForm) {

    addStudentForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const rollno =
                document.getElementById("rollno").value.trim();

            const branch =
                document.getElementById("branch").value.trim();

            const cgpa =
                parseFloat(
                    document.getElementById("cgpa").value
                );

            if (cgpa < 0 || cgpa > 10) {

                alert(
                    "CGPA must be between 0 and 10"
                );

                return;
            }

            const student = {
                name,
                rollno,
                branch,
                cgpa
            };

            await fetch(
                "http://localhost:3000/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(student)
                }
            );

            alert(
                "Student Added Successfully"
            );

            window.location.href =
                "viewstudent.html";
        }
    );
}


// =====================================================
// VIEW STUDENTS
// =====================================================

const studentTableBody =
    document.getElementById(
        "studentTableBody"
    );

if (studentTableBody) {

    displayStudents();
}

async function displayStudents() {

    const response =
        await fetch(
            "http://localhost:3000/students"
        );

    const students =
        await response.json();

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


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );

    if (!confirmDelete) {
        return;
    }

    await fetch(
        `http://localhost:3000/students/${id}`,
        {
            method: "DELETE"
        }
    );

    alert(
        "Student Deleted Successfully"
    );

    displayStudents();
}


// =====================================================
// EDIT STUDENT REDIRECT
// =====================================================

function editStudent(id) {

    window.location.href =
        `editstudent.html?xid=${id}`;
}


// =====================================================
// LOAD STUDENT FOR EDIT
// =====================================================

const editStudentForm =
    document.getElementById("editStudentForm");

if (editStudentForm) {

    loadStudent();

    async function loadStudent() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const id =
            params.get("id");

        const response =
            await fetch(
                `http://localhost:3000/students/${id}`
            );

        const student =
            await response.json();

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
        async function (e) {

            e.preventDefault();

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const id =
                params.get("id");

            const cgpa =
                parseFloat(
                    document.getElementById("cgpa").value
                );

            if (cgpa < 0 || cgpa > 10) {

                alert(
                    "CGPA must be between 0 and 10"
                );

                return;
            }

            await fetch(
                `http://localhost:3000/students/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        id: Number(id),
                        name:
                            document.getElementById("name").value.trim(),
                        rollno:
                            document.getElementById("rollno").value.trim(),
                        branch:
                            document.getElementById("branch").value.trim(),
                        cgpa
                    })
                }
            );

            alert(
                "Student Updated Successfully"
            );

            window.location.href =
                "viewstudent.html";
        }
    );
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    window.location.href =
        "login.html";
}