// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');

const { getStorage } = require('firebase/storage');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,

  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', firebaseApp.name);

const storage = getStorage(firebaseApp);

module.exports = { storage };
