// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app"); // TODO: Add SDKs for Firebase products that you want to use // https://firebase.google.com/docs/web/setup#available-libraries // Your web app's Firebase configuration
const { getStorage } = require("firebase/storage");
const dotenv = require("dotenv");
dotenv.config();
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.appId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

module.exports.app = app;
module.exports.storage = storage;
