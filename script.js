import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQK0FdOyh4gzSZdF_CGDsD_uu2mPbTMMk",
    authDomain: "greenbiophore.firebaseapp.com",
    databaseURL: "https://greenbiophore-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "greenbiophore",
    storageBucket: "greenbiophore.appspot.com",
    messagingSenderId: "1050918884464",
    appId: "1:1050918884464:web:56bfbe6f6c33212baf10b5",
    measurementId: "G-6C85CGSHFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to add a note to a specific table
function addNote(tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);

    // Create a new row for the note
    const newRow = document.createElement('tr');
    const newCell = document.createElement('td');

    // Create the textarea for note input
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Type your note here...';
    newCell.appendChild(textarea);

    // Add the submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    newCell.appendChild(submitButton);
    newRow.appendChild(newCell);
    tableBody.appendChild(newRow);

    // Function to handle the note submission
    function submitNote() {
        const noteText = textarea.value.trim();
        if (noteText) {
            // Get the current date and time
            const now = new Date();
            const formattedDate = now.toLocaleString();

            // Add the note with the timestamp and background color
            newCell.innerHTML = `${noteText}<br>(${formattedDate})`;
            newCell.style.backgroundColor = '#ffffff85'; // color
            newCell.style.padding = '10px'; // Add some padding for the note

            // Save note to Firebase
            saveNoteToFirebase(tableId, noteText, formattedDate);
        } else {
            alert("Please enter a note!");
        }
    }

    // When the user clicks "Submit"
    submitButton.addEventListener('click', submitNote);

    // Allow submission when the user presses Enter (key code 13)
    textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of the Enter key (like line breaks)
            submitNote();
        }
    });
}

// Function to save the note to Firebase
function saveNoteToFirebase(tableId, noteText, formattedDate) {
    const noteData = {
        text: noteText,
        date: formattedDate,
        votes: { thumbsUp: 0, thumbsDown: 0 }
    };

    // Save the note under the correct tableId in Firebase
    const tableRef = ref(database, tableId);
    push(tableRef, noteData)
        .then(() => {
            console.log("Note successfully saved to Firebase!");
        })
        .catch((error) => {
            console.error("Error saving note to Firebase:", error);
        });
}

// Function to load notes from Firebase
function loadNotesFromFirebase() {
    const tableIds = ['table1', 'table2', 'table3', 'table4'];
    tableIds.forEach(function (tableId) {
        const tableRef = ref(database, tableId);
        onValue(tableRef, function (snapshot) {
            const tableBody = document.querySelector(`#${tableId} tbody`);
            tableBody.innerHTML = ''; // Clear current content before adding fetched notes

            snapshot.forEach(function(childSnapshot) {
                const noteData = childSnapshot.val();
                const newRow = document.createElement('tr');
                const newCell = document.createElement('td');
                newCell.innerHTML = `${noteData.text}<br>(${noteData.date})`;
                newCell.style.backgroundColor = '#ffffff85';
                newCell.style.padding = '10px';

                // Add vote counts
                const voteCount = document.createElement('span');
                voteCount.innerHTML = `Votes: ${noteData.votes.thumbsUp} 👍 / ${noteData.votes.thumbsDown} 👎`;
                newCell.appendChild(voteCount);

                newRow.appendChild(newCell);
                tableBody.appendChild(newRow);
            });
        });
    });
}

// Call this function when the page loads to load existing notes from Firebase
window.onload = function() {
    loadNotesFromFirebase();
};
