// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyiajp4XCJ47Qnn2nEIs2me0n_yXjY-7w",
  authDomain: "signup-page-52cd3.firebaseapp.com",
  projectId: "signup-page-52cd3",
  storageBucket: "signup-page-52cd3.firebasestorage.app",
  messagingSenderId: "1004059042004",
  appId: "1:1004059042004:web:3a0b38ce3d69bccb781b41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
function showMessage(elementId, message, isError = false) {
    const messageDiv = document.getElementById(elementId);
    if (!messageDiv) {
        console.warn('showMessage: element not found', elementId, message);
        return;
    }
    messageDiv.style.display = 'block';
    messageDiv.style.color = isError ? 'red' : 'green';
    messageDiv.textContent = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 1s';
        messageDiv.style.opacity = 0;
    }, 5000);
}

console.log('firebaseauth.js loaded');

// Initialize auth and redirect if already signed in
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('onAuthStateChanged: user is signed in:', user.uid);
        // If we're on the login/signup page, redirect to dashboard
        const path = window.location.pathname.split('/').pop();
        if (path === '' || path === 'index.html' || path === 'signup.html') {
            console.log('Redirecting to home because user is already signed in');
            window.location.href = 'home.html';
        }
    } else {
        console.log('onAuthStateChanged: no user signed in');
    }
});
 //sign up functionality
const signUp=document.getElementById('signup-submit');
if (signUp) {
    console.log('Attaching signup click listener');
    signUp.addEventListener('click',(e)=>{
        e.preventDefault();
        console.log('Signup clicked');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullname = document.getElementById('fullname') ? document.getElementById('fullname').value : '';
        const companyname = document.getElementById('companyname') ? document.getElementById('companyname').value : '';


    const db = getFirestore();
    console.log('Creating user with email:', email);
    // auth is initialized above; reuse it
    // const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
                .then(async(userCredential) => {
          // Signed in 
          const user = userCredential.user;
        const userData = {
            email: email,
            fullname: fullname,
            companyname: companyname
        };
        showMessage('signUpMessage', 'User registered successfully!');
        await setDoc(doc(db, "users", user.uid), userData);
        window.location.href = 'index.html';
    })
        .catch((error) => {
        console.error("Signup Error:", error);
        showMessage('signUpMessage', error.message || 'Sign up failed', true);
    });
    });
}

///sign in functionality
const signIn=document.getElementById('signin-submit');
if (signIn) {
    console.log('Attaching signin click listener');
    signIn.addEventListener('click',(e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Attempting sign-in for', email);

        // auth is initialized above
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Sign-in successful for user:', user.uid);
            showMessage('signInMessage', 'User signed in successfully!');
            localStorage.setItem('loggedInUserId', user.uid)
            // small delay to allow UI update
            setTimeout(() => {
                console.log('Redirecting to dashboard.html');
                window.location.href = 'dashboard.html';
            }, 300);
        })
       .catch((error) => {
            console.error('Sign-in error:', error);
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
                showMessage('signInMessage', 'Incorrect Email or Password', true);
            }
            else {
                showMessage('signInMessage', error.message || 'Account does not exist', true);
            }
        });
    });
}