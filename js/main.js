import { signIn } from "./auth.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageDiv = document.getElementById("signInMessage");
const submitButton = document.getElementById("signin-submit");

function showMessage(text, isError = false) {
    messageDiv.style.display = "block";
    messageDiv.textContent = text;
    messageDiv.className = isError ? "messageDiv error" : "messageDiv success";
}

function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
    if (isLoading) {
        // Add a spinner to the button
        submitButton.innerHTML = `<span class="spinner"></span> Signing in...`;
        showMessage("Signing in, please wait...");
    } else {
        submitButton.innerHTML = "Sign In";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Email and password are required", true);
        return;
    }

    setLoadingState(true);

    try {
        const response = await signIn(email, password);
        showMessage("Signed in successfully");

        window.location.href = "/home.html";

    } catch (err) {
        console.error("Sign-in error:", err);

        // Display a user-friendly error message
        if (err.response) {
            showMessage(err.response.data?.message || "Sign-in failed", true);
        } else if (err.request) {
            showMessage("No response from server. Please try again later.", true);
        } else {
            showMessage("An unexpected error occurred. Please try again.", true);
        }
    } finally {
        setLoadingState(false);
    }
});