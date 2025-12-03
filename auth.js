import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuu2b0I2D4UX-tFJu-4dEXwZAU0Koui6U",
  authDomain: "jokes-on-you-ea61b.firebaseapp.com",
  projectId: "jokes-on-you-ea61b",
  storageBucket: "jokes-on-you-ea61b.firebasestorage.app",
  messagingSenderId: "831999849916",
  appId: "1:831999849916:web:d5b4ffff5ce09605c0a7b9",
  measurementId: "G-8TNMSY9H2G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Register user
async function registerUser(username, password, profilePicUrl = "") {
  const email = username.includes('@') ? username : `${username}@jokesonyou.fake`;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: username, photoURL: profilePicUrl || undefined });
  await setDoc(doc(db, "users", user.uid), {
    username: username,
    email: email,
    profilePic: profilePicUrl || "",
    created: new Date().toISOString()
  });
  return user;
}

// Login user
async function loginUser(username, password) {
  const email = username.includes('@') ? username : `${username}@jokesonyou.fake`;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('landingRegBtn').addEventListener('click', async () => {
    const u = document.getElementById('landingRegUser').value.trim();
    const p = document.getElementById('landingRegPass').value;
    const p2 = document.getElementById('landingRegPass2').value;
    document.getElementById('landingRegMsg').textContent = '';
    if (!u) { document.getElementById('landingRegUserErr').textContent = 'Enter a username'; return; } else { document.getElementById('landingRegUserErr').textContent = ''; }
    if (!p || p.length < 6) { document.getElementById('landingRegPassErr').textContent = 'Password must be 6+ chars'; return; } else { document.getElementById('landingRegPassErr').textContent = ''; }
    if (p !== p2) { document.getElementById('landingRegPass2Err').textContent = 'Passwords do not match'; return; } else { document.getElementById('landingRegPass2Err').textContent = ''; }
    try {
      await registerUser(u, p);
      document.getElementById('landingRegMsg').textContent = 'Registration successful!';
    } catch (err) {
      console.error('register error', err);
      document.getElementById('landingRegMsg').textContent = err.message === 'username_taken' ? 'username taken' : (err.message || 'Registration failed');
    }
  });

  document.getElementById('landingLoginBtn').addEventListener('click', async () => {
    const u = document.getElementById('landingLoginUser').value.trim();
    const p = document.getElementById('landingLoginPass').value;
    document.getElementById('landingLoginMsg').textContent = '';
    try {
      await loginUser(u, p);
      document.getElementById('landingLoginMsg').textContent = 'Login successful!';
    } catch (err) {
      console.error('login error', err);
      document.getElementById('landingLoginMsg').textContent = err.message === 'wrong_credentials' ? 'wrong credentials' : (err.message || 'Login failed');
    }
  });
});
