import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");
const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");

let savedFiles = [];
async function loadFiles() {
    savedFiles = [];

    const snapshot = await getDocs(collection(db, "sassyFiles"));

    snapshot.forEach(item => {
        savedFiles.push({
            id: item.id,
            ...item.data()
        });
    });

    // 図面番号順 → 新しい日付順
    savedFiles.sort((a, b) => {
        const num = (a.number || "").localeCompare(b.number || "", "ja");
        if (num !== 0) return num;
        return (b.date || "").localeCompare(a.date || "");
    });

    displayFiles();
}

function displayFiles() {

    fileList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();

    const list = savedFiles.filter(file => {

        const match =
            (file.number || "").toLowerCase().includes(keyword) ||
            (file.title || "").toLowerCase().includes(keyword) ||
            (file.fileName || "").toLowerCase().includes(keyword);

        const latest =
            !latestOnly.checked || file.latest;

        return match && latest;

    });

    list.forEach(file => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="name">
                ${file.number}
                ${file.latest ? " ★最新版" : ""}
            </div>

            <div>${file.title}</div>

            <div class="type">
                ${file.fileName}
            </div>

            <div class="memo">
                ${file.memo || ""}
            </div>

            <div class="date">
                ${file.date}
            </div>

            <button class="edit">編集</button>
            <button class="delete">削除</button>
        `;

        card.onclick = () => {
            if (file.url) {
                window.open(file.url, "_blank");
            }
        };

        card.querySelector(".edit").onclick = e => {
            e.stopPropagation();
            editMemo(file.id);
        };

        card.querySelector(".delete").onclick = e => {
            e.stopPropagation();
            deleteFile(file);
        };

        fileList.appendChild(card);

    });

}
fileInput.addEventListener("change", async () => {

    const file = fileInput.files[0];

    if (!file) return;

    // 同じ図面番号の旧版を最新版解除
    const snapshot = await getDocs(collection(db, "sassyFiles"));

    for (const item of snapshot.docs) {

        const data = item.data();

        if (
            data.number === drawingNumber.value &&
            data.latest === true
        ) {

            await updateDoc(
                doc(db, "sassyFiles", item.id),
                {
                    latest: false
                }
            );

        }

    }

    // Storageへアップロード
    const storageRef = ref(
        storage,
        `drawings/${Date.now()}_${file.name}`
    );

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
      await addDoc(
        collection(db, "sassyFiles"),
        {
            number: drawingNumber.value.trim(),
            title: drawingName.value.trim(),
            memo: drawingMemo.value.trim(),
            latest: true,
            date: new Date().toLocaleString("ja-JP"),
            fileName: file.name,
            url: downloadURL,
            storagePath: storageRef.fullPath
        }
    );

    // 入力欄をリセット
    drawingNumber.value = "";
    drawingName.value = "";
    drawingMemo.value = "";
    fileInput.value = "";

    alert("保存しました！");

    await loadFiles();

});
