function openDialog() {
  document.getElementById("dialog").style.display = "block";
}

function closeDialog() {
  document.getElementById("dialog").style.display = "none";
}

function showSignInPage() {
  document.getElementById("signupPage").style.display = "none";
  document.getElementById("signinPage").style.display = "block";
}

function showSignUpPage() {
  document.getElementById("signinPage").style.display = "none";
  document.getElementById("signupPage").style.display = "block";
}

document.getElementById("signupForm").addEventListener("submit", function(event) {
  event.preventDefault();
  // Handle sign-up form submission
  // You can use AJAX or perform any necessary operations here
  // For example:
  // - Perform form validation
  // - Send data to the server using fetch or XMLHttpRequest
  // - Process the response from the server
});

document.getElementById("signinForm").addEventListener("submit", function(event) {
  event.preventDefault();
  // Handle sign-in form submission
  // You can use AJAX or perform any necessary operations here
  // For example:
  // - Perform form validation
  // - Send data to the server using fetch or XMLHttpRequest
  // - Process the response from the server
});

document.getElementById("signinLink").addEventListener("click", function(event) {
  event.preventDefault();
  showSignInPage();
});

document.getElementById("signupLink").addEventListener("click", function(event) {
  event.preventDefault();
  showSignUpPage();
});
