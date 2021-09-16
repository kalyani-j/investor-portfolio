const profileFormHandler = async (event) => {
    event.preventDefault();

    const fname = document.getElementById('firstName').value.trim();
    const lname = document.getElementById('lastName').value.trim();
    const username = document.getElementById('userName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (fname || lname || username || email || password) {
      const response = await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ fname, lname, username, email, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        alert(response.statusText);
      } else {
        alert(response.statusText);
      }
    }

}

document
  .getElementById("edit-profile")
  .addEventListener("click", profileFormHandler);