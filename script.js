import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQK0FdOyh4gzSZdF_CGDsD_uu2mPbTMMk",
    authDomain: "greenbiophore.firebaseapp.com",
    databaseURL: "https://greenbiophore-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "greenbiophore",
    storageBucket: "greenbiophore.firebasestorage.app",
    messagingSenderId: "1050918884464",
    appId: "1:1050918884464:web:56bfbe6f6c33212baf10b5",
    measurementId: "G-6C85CGSHFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to add a note
function addNote(tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    
    const newRow = document.createElement('tr');
    const newCell = document.createElement('td');
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Type your note here...';
    newCell.appendChild(textarea);
    
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    newCell.appendChild(submitButton);
    
    newRow.appendChild(newCell);
    tableBody.appendChild(newRow);

    submitButton.addEventListener('click', function () {
        const noteText = textarea.value.trim();
        if (noteText) {
            const now = new Date();
            const formattedDate = now.toLocaleString();
            
            newCell.innerHTML = `${noteText} <span style="font-size: 0.8em; color: gray;">(${formattedDate})</span>`;
            newCell.style.backgroundColor = '#ffffff85';
            newCell.style.padding = '10px';

            saveNoteToFirebase(tableId, noteText, formattedDate);
        } else {
            alert("Please enter a note!");
        }
    });
}

// Save note to Firebase
function saveNoteToFirebase(tableId, noteText, formattedDate) {
    const noteData = {
        text: noteText,
        date: formattedDate
    };

    const tableRef = ref(database, tableId);
    push(tableRef, noteData);
}

// Load notes from Firebase
function loadNotesFromFirebase() {
    const tableIds = ['table1', 'table2', 'table3', 'table4'];

    tableIds.forEach(tableId => {
        const tableRef = ref(database, tableId);
        
        onChildAdded(tableRef, (snapshot) => {
            const noteData = snapshot.val();

            const tableBody = document.querySelector(`#${tableId} tbody`);
            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');

            newCell.innerHTML = `${noteData.text} <span style="font-size: 0.8em; color: gray;">(${noteData.date})</span>`;
            newCell.style.backgroundColor = '#ffffff85';
            newCell.style.padding = '10px';

            newRow.appendChild(newCell);
            tableBody.appendChild(newRow);
        });
    });
}

// Make addNote globally accessible
window.addNote = addNote;

window.onload = loadNotesFromFirebase;
