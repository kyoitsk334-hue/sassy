const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");
const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");


let savedFiles = JSON.parse(localStorage.getItem("sassyFiles")) || [];



function displayFiles(){

    fileList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();


    savedFiles
    .filter(file => {

        const matchKeyword =
            (file.number || "").toLowerCase().includes(keyword) ||
            (file.title || "").toLowerCase().includes(keyword) ||
            (file.name || "").toLowerCase().includes(keyword);


        const matchLatest =
            !latestOnly.checked || file.latest;


        return matchKeyword && matchLatest;

    })
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
        ${file.latest ? " ★最新版" : ""}

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


    const duplicate = savedFiles.some(file =>
        file.number === drawingNumber.value
    );


    if(duplicate){


        const result = confirm(
            "同じ図面番号があります。\n最新版として追加しますか？"
        );


        if(!result){

            this.value = "";

            return;

        }

    }



    const files=this.files;


    let count=0;



    Array.from(files).forEach(file=>{


        const reader=new FileReader();



        reader.onload=function(e){



            savedFiles.forEach(oldFile=>{


                if(oldFile.number === drawingNumber.value){

                    oldFile.latest=false;

                }


            });




            savedFiles.push({


                number:drawingNumber.value,


                title:drawingName.value,


                memo:drawingMemo.value,


                latest:true,


                date:new Date().toLocaleString(),


                name:file.name,


                type:file.type,


                url:e.target.result


            });




            count++;




            if(count===files.length){



                localStorage.setItem(

                    "sassyFiles",

                    JSON.stringify(savedFiles)

                );



                displayFiles();



                drawingNumber.value="";

                drawingName.value="";

                drawingMemo.value="";

            }



        };



        reader.readAsDataURL(file);



    });



});






function editMemo(index){



    const newMemo = prompt(

        "メモを編集してください",

        savedFiles[index].memo || ""

    );



    if(newMemo !== null){


        savedFiles[index].memo = newMemo;


        localStorage.setItem(

            "sassyFiles",

            JSON.stringify(savedFiles)

        );


        displayFiles();


    }


}






function deleteFile(index){



    const result = confirm(

        "この図面を削除しますか？"

    );



    if(result){


        savedFiles.splice(index,1);


        localStorage.setItem(

            "sassyFiles",

            JSON.stringify(savedFiles)

        );


        displayFiles();


    }


}






searchInput.addEventListener("input",function(){

    displayFiles();

});



latestOnly.addEventListener("change",function(){

    displayFiles();

});





displayFiles();
