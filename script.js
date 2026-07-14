import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyCpozLhjqRzC3XMHNWncGTeJ78u9AAoc9I",
    authDomain: "sassy-fcc3d.firebaseapp.com",
    projectId: "sassy-fcc3d",
    storageBucket: "sassy-fcc3d.firebasestorage.app",
    messagingSenderId: "272983594177",
    appId: "1:272983594177:web:0ecc108116c60ab4f87040"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);


// HTML取得

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const projectName = document.getElementById("projectName");
const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");

const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");


// データ

let savedFiles = [];

let openedProjects = {};


// =========================
// 一覧表示
// =========================

function displayFiles(){

    fileList.innerHTML = "";

    const keyword =
        searchInput.value.toLowerCase();


    const projects = {};


    savedFiles.forEach(file=>{

        const project =
            file.project || "工事名未設定";


        const match =
            (file.project || "").toLowerCase().includes(keyword) ||
            (file.number || "").toLowerCase().includes(keyword) ||
            (file.title || "").toLowerCase().includes(keyword) ||
            (file.fileName || "").toLowerCase().includes(keyword);


        const latest =
            !latestOnly.checked || file.latest;


        if(!(match && latest)) return;


        if(!projects[project]){
            projects[project] = [];
        }


        projects[project].push(file);

    });


    Object.keys(projects).forEach(project=>{


        const folder =
            document.createElement("div");


        folder.className="card";


        folder.innerHTML = `
        <div class="name">
        ${openedProjects[project] ? "📂":"📁"}
        ${project}
        </div>
        `;


        folder.onclick=()=>{

            openedProjects[project]
            =
            !openedProjects[project];

            displayFiles();

        };


        fileList.appendChild(folder);



        if(!openedProjects[project])
            return;



        projects[project].forEach(file=>{

            const card =
                document.createElement("div");


            card.className="card";


            card.style.marginLeft="25px";


            card.innerHTML=`

            <div class="name">
            ${file.number}
            ${file.latest ? " ★最新版":""}
            </div>

            <div>
            ${file.title || ""}
            </div>

            <div>
            ${file.fileName}
            </div>

            <div>
            ${file.memo || ""}
            </div>

            <div>
            ${file.date}
            </div>


            <button class="edit">
            編集
            </button>

            <button class="delete">
            削除
            </button>

            `;


            card.onclick=()=>{

                if(file.url){

                    window.open(
                        file.url,
                        "_blank"
                    );

                }

            };


            fileList.appendChild(card);


        });


    });


}
