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
console.log("ファイル選択イベント開始");

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

// ===== HTML取得 =====

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const projectName = document.getElementById("projectName");
const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");

const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");

// ===== データ =====

let savedFiles = [];

// フォルダの開閉状態
let openedProjects = {};

// =========================
// Firestore読込み
// =========================

async function loadFiles() {
// =========================
// 一覧表示
// =========================

function displayFiles() {

    fileList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();

    // 工事ごとにまとめる
    const projects = {};

    savedFiles.forEach(file => {

        const project = file.project || "工事名未設定";

        const match =
            (file.project || "").toLowerCase().includes(keyword) ||
            (file.number || "").toLowerCase().includes(keyword) ||
            (file.title || "").toLowerCase().includes(keyword) ||
            (file.fileName || "").toLowerCase().includes(keyword);

        const latest =
            !latestOnly.checked || file.latest;

        if (!(match && latest)) return;

        if (!projects[project]) {
            projects[project] = [];
        }

        projects[project].push(file);

    });

    // フォルダ表示
    Object.keys(projects).forEach(project => {

        const folder = document.createElement("div");

        folder.className = "card";

        folder.style.cursor = "pointer";

        folder.innerHTML = `
            <div class="name">
                ${openedProjects[project] ? "📂" : "📁"}
                ${project}
            </div>
        `;

        folder.onclick = () => {

            openedProjects[project] =
                !openedProjects[project];

            displayFiles();

        };

        fileList.appendChild(folder);

        // 閉じている時は図面を表示しない
        if (!openedProjects[project]) return;

        projects[project].forEach(file => {

            const card =
                document.createElement("div");

            card.className = "card";

            card.style.marginLeft = "25px";

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

                    window.open(
                        file.url,
                        "_blank"
                    );

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

    });

}
    savedFiles = [];

    const snapshot =
        await getDocs(collection(db, "sassyFiles"));

    snapshot.forEach(docSnap => {

        savedFiles.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    // 工事名→図面番号→追加日で並び替え
    savedFiles.sort((a, b) => {

        const project =
            (a.project || "").localeCompare(
                b.project || "",
                "ja"
            );

        if (project !== 0) return project;

        const number =
            (a.number || "").localeCompare(
                b.number || "",
                "ja"
            );

        if (number !== 0) return number;

        return (b.date || "")
            .localeCompare(a.date || "");

    });

    displayFiles();
}   //
// =========================
// 保存処理
// =========================

fileInput.addEventListener("change", async () => {
    
console.log("ファイル選択されました");
    const file = fileInput.files[0];

    if (!file) return;

    if (!projectName.value.trim()) {
        alert("工事名を入力してください。");
        return;
    }

    if (!drawingNumber.value.trim()) {
        alert("図面番号を入力してください。");
        return;
    }

    // 同じ工事・同じ図面番号の最新版を解除
    const snapshot = await getDocs(collection(db, "sassyFiles"));

    for (const item of snapshot.docs) {

        const data = item.data();

        if (
            data.project === projectName.value.trim() &&
            data.number === drawingNumber.value.trim() &&
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
    console.log("Storageアップロード完了");

    const downloadURL =
        await getDownloadURL(storageRef);

    // Firestoreへ保存
    await addDoc(
        collection(db, "sassyFiles"),
        {
            project: projectName.value.trim(),
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
console.log("Firestore保存完了");
    // 入力欄リセット
    drawingNumber.value = "";
    drawingName.value = "";
    drawingMemo.value = "";
    fileInput.value = "";

    alert("保存しました！");

    await loadFiles();

});
  // =========================
// メモ編集
// =========================

async function editMemo(id) {

    const target =
        savedFiles.find(file => file.id === id);

    if (!target) return;

    const memo =
        prompt("メモを編集", target.memo || "");

    if (memo === null) return;

    await updateDoc(
        doc(db, "sassyFiles", id),
        {
            memo: memo.trim()
        }
    );

    await loadFiles();

}

// =========================
// 削除
// =========================

async function deleteFile(file) {

    if (!confirm("この図面を削除しますか？")) return;

    try {

        await deleteDoc(
            doc(db, "sassyFiles", file.id)
        );

        if (file.storagePath) {

            const fileRef =
                ref(storage, file.storagePath);

            await deleteObject(fileRef);

        }

        await loadFiles();

        alert("削除しました。");

    } catch (error) {

        console.error(error);

        alert("削除に失敗しました。");

    }

}

// =========================
// 検索・チェックボックス
// =========================

searchInput.addEventListener(
    "input",
    displayFiles
);

latestOnly.addEventListener(
    "change",
    displayFiles
);
