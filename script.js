import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
getStorage,
ref,
uploadBytes,
getDownloadURL,
deleteObject
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



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




const fileInput =
document.getElementById("fileInput");


const fileList =
document.getElementById("fileList");


const drawingNumber =
document.getElementById("drawingNumber");


const drawingName =
document.getElementById("drawingName");


const drawingMemo =
document.getElementById("drawingMemo");


const searchInput =
document.getElementById("searchInput");


const latestOnly =
document.getElementById("latestOnly");



let savedFiles=[];




async function loadFiles(){


savedFiles=[];


const snapshot =
await getDocs(
collection(db,"sassyFiles")
);



snapshot.forEach(item=>{


savedFiles.push({

id:item.id,

...item.data()

});


});


displayFiles();


}







function displayFiles(){


fileList.innerHTML="";


const keyword =
searchInput.value.toLowerCase();



savedFiles


.filter(file=>{


const match =

(file.number || "")
.toLowerCase()
.includes(keyword)

||

(file.title || "")
.toLowerCase()
.includes(keyword);



const latest =

!latestOnly.checked
||
file.latest;



return match && latest;



})



.forEach(file=>{


const card =
document.createElement("div");


card.className="card";



card.innerHTML=`

<div class="name">

${file.number || ""}
${file.title || ""}

${file.latest ? "★最新版":""}

</div>


<div class="type">

${file.fileName || ""}

</div>


<div class="date">

追加日：
${file.date || ""}

</div>


<div class="memo">

メモ：
${file.memo || ""}

</div>


<button class="edit">

編集

</button>


<button class="delete">

削除

</button>

`;



card.onclick=function(){

if(file.url){

window.open(
file.url,
"_blank"
);

}

};



card.querySelector(".edit")
.onclick=function(e){

e.stopPropagation();

editMemo(file.id);

};



card.querySelector(".delete")
.onclick=function(e){

e.stopPropagation();

deleteFile(file);

};



fileList.appendChild(card);



});


}







fileInput.addEventListener(
"change",
async function(){


const file=this.files[0];


if(!file)return;



const storageRef =
ref(
storage,
"drawings/"
+
Date.now()
+
"_"
+
file.name
);



await uploadBytes(
storageRef,
file
);



const downloadURL =
await getDownloadURL(
storageRef
);




await addDoc(

collection(db,"sassyFiles"),

{


number:drawingNumber.value,


title:drawingName.value,


memo:drawingMemo.value,


latest:true,


date:new Date()
.toLocaleString(),


fileName:file.name,


url:downloadURL,


storagePath:storageRef.fullPath


}

);



alert("保存しました");


loadFiles();



});








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


const fileRef =
ref(
storage,
file.storagePath
);


await deleteObject(fileRef);


}



loadFiles();



}







async function editMemo(id){


const target =
savedFiles.find(
file=>file.id===id
);



const memo =
prompt(
"メモ編集",
target.memo || ""
);



if(memo!==null){


await updateDoc(

doc(
db,
"sassyFiles",
id
),

{

memo:memo

}

);



loadFiles();



}


}





searchInput.addEventListener(
"input",
displayFiles
);



latestOnly.addEventListener(
"change",
displayFiles
);



loadFiles();
