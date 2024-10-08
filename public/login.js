const loginForm = document.getElementById("form-login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const userData = {};
  console.log(formData);
  formData.forEach((value, key) => {
    userData[key] = value;
  });
  console.log("login submit ", userData);
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
});
