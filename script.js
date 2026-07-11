import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { 
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



const firebaseConfig = {

    apiKey: "AIzaSyCpozLhjqRzC3XMHNWncGTeJ78u9AAoc9I",
    authDomain: "sassy-fcc3d.firebaseapp.com",
    projectId: "sassy-fcc3d",
    storageBucket: "sassy-fcc3d.firebasestorage.app",
    messagingSenderId: "272983594177",
    appId: "1:272983594177:web:0ecc108116c60ab4f87040",
    measurementId: "G-7LMKM92W44"

};



const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);




const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");

const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");



let savedFiles = [];





async function loadFiles(){


    savedFiles=[];


    const snapshot = await getDocs(
        collection(db,"s
