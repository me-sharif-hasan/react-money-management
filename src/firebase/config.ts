// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBw_z6aCe4n0LlxTdbvVFPvy0avdIyAyDo",
    authDomain: "mn-accounting.firebaseapp.com",
    projectId: "mn-accounting",
    storageBucket: "mn-accounting.appspot.com",
    messagingSenderId: "35181883997",
    appId: "1:35181883997:web:a0d8275554fac8454393b4",
    measurementId: "G-XGQWWTNB0C",
    databaseURL: "https://mn-accounting-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db=getDatabase(app)
export default {auth,provider,app,db}

export const authConfig={
    sectorRoot:""
}


export const getTime=(now:Date)=>{
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + (month) + "-" + (day);
}