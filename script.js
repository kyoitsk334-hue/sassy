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



const fileList = document.getElementById("fileList");

const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");
const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");

const fileInput = document.getElementById("fileInput");



let savedFiles = [];





async function loadFiles(){


    savedFiles = [];


    const snapshot = await getDocs(
        collection(db,"sassyFiles")
    );


    snapshot.forEach((doc)=>{


        savedFiles.push({

            id:doc.id,
            ...doc.data()

        });


    });



    displayFiles();


}







function displayFiles(){


    fileList.innerHTML="";


    const keyword = searchInput.value.toLowerCase();



    savedFiles

    .filter(file=>{


        const match =

        (file.number || "").toLowerCase().includes(keyword) ||
        (file.title || "").toLowerCase().includes(keyword);



        const latest =

        !latestOnly.checked || file.latest;



        return match && latest;


    })


    .forEach(file=>{


        const card=document.createElement("div");

        card.className="card";


        card.innerHTML=`

        <div class="name">

        ${file.number}
        ${file.title}
        ${file.latest ? "★最新版":""}

        </div>


        <div class="date">

        ${file.date}

        </div>


        <div class="memo">

        メモ:${file.memo || ""}

        </div>


        <button>

        編集

       
