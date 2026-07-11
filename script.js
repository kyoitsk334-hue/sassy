const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", function () {

    for (const file of this.files) {

        const url = URL.createObjectURL(file);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="name">${file.name}</div>
            <div class="type">${file.type}</div>
        `;

        card.onclick = () => {
            window.open(url, "_blank");
        };

        fileList.prepend(card);
    }

    this.value = "";

});
