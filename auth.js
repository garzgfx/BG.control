// auth.js

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    auth,
    firestore
} from "./firebase.js";


// ============================================
// GOOGLE LOGIN
// ============================================

const googleProvider = new GoogleAuthProvider();

async function loginWithGoogle() {

    try {

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );

        const user = result.user;

        // Create/update user profile
        await setDoc(
            doc(
                firestore,
                "users",
                user.uid
            ),
            {
                uid: user.uid,
                name: user.displayName || "",
                email: user.email || "",
                photoURL: user.photoURL || "",
                lastLogin: serverTimestamp()
            },
            {
                merge: true
            }
        );

        console.log(
            "Logged in:",
            user.email
        );

    } catch (error) {

        console.error(
            "Google login failed:",
            error
        );

        alert(
            "Login failed: " +
            error.message
        );

    }

}


// ============================================
// LOGOUT
// ============================================

async function logout() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    }

}


// ============================================
// AUTH STATE
// ============================================

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            console.log(
                "Authenticated:",
                user.email
            );

            window.currentUser = user;

            showApp(user);

        } else {

            console.log(
                "Not authenticated"
            );

            window.currentUser = null;

            showLogin();

        }

    }
);


// ============================================
// SHOW APP
// ============================================

function showApp(user) {

    const app =
        document.querySelector(".app");

    if (app) {
        app.classList.remove("hidden");
    }

    const login =
        document.getElementById(
            "login-screen"
        );

    if (login) {
        login.classList.add("hidden");
    }

    // Update profile
    const profileName =
        document.querySelector(
            ".profile strong"
        );

    if (profileName) {
        profileName.textContent =
            user.displayName || "Garz";
    }

    const avatar =
        document.querySelector(
            ".avatar"
        );

    if (avatar) {

        if (user.photoURL) {

            avatar.innerHTML =
                `<img
                    src="${user.photoURL}"
                    alt=""
                >`;

        } else {

            avatar.textContent =
                (
                    user.displayName ||
                    "G"
                )
                .charAt(0)
                .toUpperCase();

        }

    }

}


// ============================================
// SHOW LOGIN
// ============================================

function showLogin() {

    const app =
        document.querySelector(".app");

    if (app) {
        app.classList.add("hidden");
    }

    const login =
        document.getElementById(
            "login-screen"
        );

    if (login) {
        login.classList.remove("hidden");
    }

}


// ============================================
// BUTTONS
// ============================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#google-login"
            )
        ) {

            loginWithGoogle();

        }

        if (
            event.target.closest(
                "#logout-btn"
            )
        ) {

            logout();

        }

    }
);