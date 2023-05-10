const form = document.querySelector(".shopping-form");
const alert = document.querySelector(".alert");
const shopping = document.getElementById("shopping");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".shopping-container");
const list = document.querySelector(".shopping-list");
const clearBtn = document.querySelector(".clear-btn");
const downloadBtn = document.querySelector(".download-btn");
let editElement;
let editFlag = false;
let editID = "";
// const downloadBtn = document.getElementById("download-btn");
// downloadBtn.addEventListener("click", generatePDF);

form.addEventListener("submit", addItems);
clearBtn.addEventListener("click", clearItems);
downloadBtn.addEventListener("click", downloadList);
window.addEventListener("DOMContentLoaded", setupItems);


function addItems(e) {
    e.preventDefault();
    let value = shopping.value;
    let id = new Date().getTime().toString();

    if (value && ! editFlag) {
        createListItem(id, value);
        displayAlert("item added to the list", "success");
        container.classList.add("show-container");
        addToLocalStorage(id, value);
        setBackToDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("Please enter value", "danger");
    }
}


function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 2000);
}

function setBackToDefault() {
    shopping.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

function clearItems() {
    const items = document.querySelectorAll(".shopping-item");
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

function downloadList() {
    const items = document.querySelectorAll(".shopping-item");
    let data = [];
    items.forEach((item) => {
        data.push(item.innerText.trim());
    });
    let link = document.createElement("a");
    link.download = "shopping-list.txt";
    link.href = "data:text/plain," + data.join("\n");
    link.click();
    URL.revokeObjectURL(link.href);
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }

    displayAlert("item removed", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    shopping.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

function addToLocalStorage(id, value) {
    const shopping = { id, value };
    let items = getLocalStorage();
    items.push(shopping);
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}

//Remove from Local Storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}


function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("shopping-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
}

// function generatePDF() {
//     // create a new jsPDF instance
//     const doc = new jsPDF();
//     console.log("gv hbmj,nm");
//     // get the shopping list container element
//     const shoppingList = document.querySelector('.shopping-list');
//
//     // get the table data
//     const tableData = [];
//     shoppingList.querySelectorAll('article').forEach(item => {
//         const id = item.getAttribute('data-id');
//         const title = item.querySelector('.title').textContent;
//         tableData.push([id, title]);
//     });
//
//     // set up the table
//     const headers = [['ID', 'Title']];
//     doc.autoTable({
//         head: headers,
//         body: tableData,
//         startY: 20,
//     });
//
//     // save the PDF file
//     doc.save('shopping-list.pdf');
// }
//

// Select the download button element




