const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

let savedFiles = JSON.parse(localStorage.getItem("sassyFiles")) || [];

function displayFiles(){

    fileList.innerHTML = "";

    savedFiles.forEach((file, index) => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
    <div class="name">${file.name}</div>
    <div class="type">${file.type}</div>
    <button onclick="deleteFile(${index})">削除</button>
`;

        card.onclick = function(){
            window.open(file.url, "_blank");
        };

        fileList.appendChild(card);

    });

}


fileInput.addEventListener("change", function(){

    const files = this.files;

    let count = 0;

    Array.from(files).forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e){

            savedFiles.push({
                name: file.name,
                type: file.type,
                url: e.target.result
            });

            count++;

            if(count === files.length){

                localStorage.setItem(
                    "sassyFiles",
                    JSON.stringify(savedFiles)
                );

                displayFiles();
            }

        };

        reader.readAsDataURL(file);

    });

});


displayFiles();
