const registerForm = document.getElementById("form-registration");
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form submitted!"); // Add this line
  const formData = new FormData(registerForm);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });
  console.log("this is user data", userData);
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.text();
    })
    .then((data) => {
      console.log("response:", data);
    })
    .catch((err) => {
      console.error("There was a problem whith the fetch operation:", err);
    });
  registerForm.reset();
  window.location.href = "/";
});
