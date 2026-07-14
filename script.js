// ===============================
// Sassy デモ版
// 安全書類管理
// localStorage保存
// ===============================


// HTML取得

const fileInput = document.getElementById("fileInput");

const projectName = document.getElementById("projectName");

const categoryName = document.getElementById("categoryName");

const documentType = document.getElementById("documentType");

const documentName = document.getElementById("documentName");

const documentMemo = document.getElementById("documentMemo");

const fileList = document.getElementById("fileList");

const searchInput = document.getElementById("searchInput");

const latestOnly = document.getElementById("latestOnly");


// 保存データ

let savedFiles =
JSON.parse(localStorage.getItem("sassyFiles"))
|| [];



// ===============================
// ファイル追加
// ===============================


fileInput.addEventListener(
"change",
function(){

const file = fileInput.files[0];

if(!file) return;


// 入力チェック

if(!projectName.value.trim()){

alert("工事名を入力してください");

return;

}


if(!categoryName.value.trim()){

alert("工種を入力してください");

return;

}


if(!documentName.value.trim()){

alert("資料名を入力してください");

return;

}



// ファイル読み込み

const reader = new FileReader();


reader.onload = function(e){


const data = {


id: Date.now(),


project:
projectName.value.trim(),


category:
categoryName.value.trim(),


type:
documentType.value,


title:
documentName.value.trim(),


memo:
documentMemo.value.trim(),


fileName:
file.name,


fileData:
e.target.result,


date:
new Date().toLocaleString("ja-JP"),


latest:true


};


// 保存

savedFiles.push(data);


localStorage.setItem(
"sassyFiles",
JSON.stringify(savedFiles)
);


// 初期化

documentName.value="";
documentMemo.value="";
fileInput.value="";



alert("保存しました！");


// 表示更新

displayFiles();


};


reader.readAsDataURL(file);


});
// ===============================
// 一覧表示
// ===============================

function displayFiles(){

fileList.innerHTML = "";


const keyword =
searchInput.value.toLowerCase();



const projects = {};


// 工事ごとにまとめる

savedFiles.forEach(file=>{


const match =

file.project.toLowerCase().includes(keyword) ||

file.category.toLowerCase().includes(keyword) ||

file.type.toLowerCase().includes(keyword) ||

file.title.toLowerCase().includes(keyword);



const latest =

!latestOnly.checked || file.latest;



if(!match || !latest) return;



if(!projects[file.project]){

projects[file.project]={};

}


if(!projects[file.project][file.category]){

projects[file.project][file.category]=[];

}


projects[file.project][file.category].push(file);


});



// 表示

Object.keys(projects).forEach(project=>{


const projectBox =
document.createElement("div");


projectBox.className="card";


projectBox.innerHTML=
`
<div class="name">
🏗 ${project}
</div>
`;



fileList.appendChild(projectBox);



Object.keys(projects[project]).forEach(category=>{


const categoryBox =
document.createElement("div");


categoryBox.className="card";


categoryBox.style.marginLeft="20px";



categoryBox.innerHTML=
`
<div class="name">
📁 ${category}
</div>
`;



fileList.appendChild(categoryBox);




projects[project][category].forEach(file=>{


const card =
document.createElement("div");



card.className="card";


card.style.marginLeft="40px";



card.innerHTML=
`

<div class="name">

📄 ${file.type}

</div>


<div>

${file.title}

</div>


<div class="type">

${file.fileName}

</div>


<div class="date">

${file.date}

</div>


<button class="open">

開く

</button>


<button class="delete">

削除

</button>


`;



// 開く

card.querySelector(".open")
.onclick=function(e){

e.stopPropagation();


const win =
window.open();


win.location.href =
file.fileData;


};



// 削除

card.querySelector(".delete")
.onclick=function(e){

e.stopPropagation();


if(confirm("削除しますか？")){


savedFiles =
savedFiles.filter(
x=>x.id !== file.id
);


localStorage.setItem(
"sassyFiles",
JSON.stringify(savedFiles)
);


displayFiles();


}


};



fileList.appendChild(card);



});


});


});


}



// ===============================
// 検索
// ===============================


searchInput.addEventListener(
"input",
displayFiles
);


latestOnly.addEventListener(
"change",
displayFiles
);



// 初回表示

displayFiles();
