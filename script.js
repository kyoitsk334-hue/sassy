const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

let savedFiles = JSON.parse(localStorage.getItem("sassyFiles")) || [];

function displayFiles(){

    fileList.innerHTML = "";

    savedFiles.forEach(file => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="name">${file.name}</div>
            <div class="type">${file.type}</div>
        `;

        fileList.appendChild(card);

    });

}

fileInput.addEventListener("change", function(){

    const files = this.files;

    for(let i = 0; i < files.length; i++){

        savedFiles.push({
            name: files[i].name,
            type: files[i].type
        });

    }

    localStorage.setItem(
        "sassyFiles",
        JSON.stringify(savedFiles)
    );

    displayFiles();

});

displayFiles();
