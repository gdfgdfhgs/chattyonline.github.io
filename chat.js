import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";






const firebaseConfig = {
    apiKey: "AIzaSyCu4szIqrwXPGyqrBbbTloq0kEpzxCscuM",
    authDomain: "chatty-2f36d.firebaseapp.com",
    projectId: "chatty-2f36d",
    storageBucket: "chatty-2f36d.firebasestorage.app",
    messagingSenderId: "413882995552",
    appId: "1:413882995552:web:06e51947141ea452f2c405",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInAnonymously(auth)
    .then((userCredential) => {
        console.log("Signed in anonymously!");
        console.log("User ID:", userCredential.user.uid);
    })
    .catch((error) => {
        console.error("Authentication failed:", error);
    });

const db = getFirestore(app);

console.log("Firebase connected.");

const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const text = input.value.trim();

    if (!text || text.length > 500) {
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            text: text,
            username: "User",
            createdAt: Date.now()
        });

        input.value = "";
        input.focus();

    } catch (error) {
        console.error("Could not send message:", error);
    }
});

const messagesQuery = query(
    collection(db, "messages"),
    orderBy("createdAt")
);

onSnapshot(messagesQuery, (snapshot) => {
    messages.innerHTML = "";

    snapshot.forEach((doc) => {
        const data = doc.data();

        addMessage(
            data.username,
            data.text
        );
    });
});


function addMessage(username, text) {
    const message = document.createElement("div");
    message.className = "message";

    const name = document.createElement("span");
    name.className = "username";
    name.textContent = username + ": ";

    const body = document.createElement("span");
    body.className = "message-text";
    body.textContent = text;

    message.appendChild(name);
    message.appendChild(body);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}
