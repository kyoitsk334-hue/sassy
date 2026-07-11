const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");
const searchInput = document.getElementById("searchInput");


let savedFiles = JSON.parse(localStorage.getItem("sassyFiles")) || [];



function displayFiles(){

    fileList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();


    savedFiles
    .filter(file =>
        (file.number || "").toLowerCase().includes(keyword) ||
        (file.title || "").toLowerCase().includes(keyword) ||
        (file.name || "").toLowerCase().includes(keyword)
    )
    .sort((a,b)=>{

        return (b.latest ? 1 : 0) - (a.latest ? 1 : 0);

    })
    .forEach((file,index)=>{


        const card = document.createElement("div");

        card.className = "card";


        card.innerHTML = `

        <div class="name">

        ${file.number || ""} 
        ${file.title || ""}
        ${file.latest ? "★最新版" : ""}

        </div>


        <div class="type">

        ${file.name}

        </div>


        <div class="date">

        追加日：${file.date || ""}

        </div>


        <div class="memo">

        メモ：${file.memo || ""}

        </div>


        <button onclick="event.stopPropagation(); editMemo(${index})">

        編集

        </button>


        <button onclick="event.stopPropagation(); deleteFile(${index})">

        削除

        </button>


        `;


        card.onclick=function(){

            window.open(file.url,"_blank");

        };


        fileList.appendChild(card);


    });


}




fileInput.addEventListener("change",function(){


    const files=this.files;

    let count=0;



    Array.from(files).forEach(file=>{


        const
