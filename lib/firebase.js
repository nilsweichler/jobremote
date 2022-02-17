import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCUzsRY3nWa37Cura8ejk2r7j9UjEBFE1E",
    authDomain: "jobremote-io.firebaseapp.com",
    projectId: "jobremote-io",
    storageBucket: "jobremote-io.appspot.com",
    messagingSenderId: "437182611590",
    appId: "1:437182611590:web:ad6830dd3e46681af89107",
    measurementId: "G-DQNR4HWKXV"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();



