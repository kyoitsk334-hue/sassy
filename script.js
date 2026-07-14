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
const categoryName = document.getElementById("categoryName");
const documentType = document.getElementById("documentType");
const documentName = document.getElementById("documentName");
const documentMemo = document.getElementById("documentMemo");

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
// =========================
// Firestore読み込み
// =========================

async function loadFiles(){

    savedFiles = [];


    const snapshot =
        await getDocs(
            collection(db,"sassyFiles")
        );


    snapshot.forEach(docSnap=>{

        savedFiles.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });


    displayFiles();

}



// =========================
// 図面追加
// =========================

fileInput.addEventListener(
"change",
async()=>{


    const file =
        fileInput.files[0];


    if(!file) return;



    if(!projectName.value.trim()){

        alert("工事名を入力してください");

        return;

    }


    if(!drawingNumber.value.trim()){

        alert("図面番号を入力してください");

        return;

    }



    try{


        const storageRef =
            ref(
                storage,
                `drawings/${Date.now()}_${file.name}`
            );



        await uploadBytes(
            storageRef,
            file
        );



        const url =
            await getDownloadURL(
                storageRef
            );



        await addDoc(
            collection(db,"sassyFiles"),
            {

                project:
                projectName.value.trim(),

                number:
                drawingNumber.value.trim(),

                title:
                drawingName.value.trim(),

                memo:
                drawingMemo.value.trim(),


                fileName:
                file.name,


                url:url,


                storagePath:
                storageRef.fullPath,


                latest:true,


                date:
                new Date()
                .toLocaleString("ja-JP")

            }
        );



        alert("保存しました！");



        drawingNumber.value="";
        drawingName.value="";
        drawingMemo.value="";
        fileInput.value="";



        loadFiles();



    }catch(error){

        console.error(error);

        alert("保存失敗しました");

    }



});



// =========================
// 削除
// =========================

async function deleteFile(file){


    if(!confirm("削除しますか？"))
        return;



    await deleteDoc(
        doc(
            db,
            "sassyFiles",
            file.id
        )
    );



    if(file.storagePath){

        await deleteObject(
            ref(
                storage,
                file.storagePath
            )
        );

    }


    loadFiles();

}



// =========================
// 検索
// =========================

searchInput.addEventListener(
"input",
displayFiles
);


latestOnly.addEventListener(
"change",
displayFiles
);



// =========================
// 起動
// =========================

loadFiles();
