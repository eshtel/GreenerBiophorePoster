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

            // 🚀 Don't add the note manually! Let Firebase handle it.
            saveNoteToFirebase(tableId, noteText, formattedDate);

            // ✅ Clear input after submission
            newRow.remove();
        } else {
            alert("Please enter a note!");
        }
    });
}

// Save note to Firebase
function saveNoteToFirebase(tableId, noteText, formattedDate) {
    const noteData = {
        text: noteText,
        date: formattedDate,
        votes: {
            thumbsUp: 0,
            thumbsDown: 0
        }
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
            const noteId = snapshot.key;

            const tableBody = document.querySelector(`#${tableId} tbody`);
            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');

            newCell.innerHTML = `${noteData.text} <span style="font-size: 0.8em; color: gray;">(${noteData.date})</span>`;
            newCell.style.backgroundColor = '#ffffff85';
            newCell.style.padding = '10px';

            // Add vote buttons (Thumbs Up and Thumbs Down)
            const voteContainer = document.createElement('div');

            const thumbsUpButton = document.createElement('button');
            thumbsUpButton.innerHTML = '👍';
            thumbsUpButton.style.marginRight = '10px';
            voteContainer.appendChild(thumbsUpButton);

            const thumbsDownButton = document.createElement('button');
            thumbsDownButton.innerHTML = '👎';
            voteContainer.appendChild(thumbsDownButton);

            // Add vote counts
            const voteCount = document.createElement('span');
            voteCount.style.marginLeft = '10px';
            voteCount.innerHTML = `Votes: <span class="thumbsUpCount">${noteData.votes.thumbsUp}</span> 👍 / <span class="thumbsDownCount">${noteData.votes.thumbsDown}</span> 👎`;
            voteContainer.appendChild(voteCount);

            // Append the vote container to the note cell
            newCell.appendChild(voteContainer);
            newRow.appendChild(newCell);
            tableBody.appendChild(newRow);

            // Prevent user from voting more than once
            if (hasUserVoted(noteId)) {
                thumbsUpButton.disabled = true;
                thumbsDownButton.disabled = true;
            }

            // Handle voting for thumbs up
            thumbsUpButton.addEventListener('click', function () {
                if (!hasUserVoted(noteId)) {
                    noteData.votes.thumbsUp++;
                    updateVoteInFirebase(tableId, noteId, noteData.votes);
                    saveVoteStatus(noteId); // Save user's vote to prevent multiple votes

                    // Update the UI with new vote counts
                    const thumbsUpElements = newCell.querySelectorAll('.thumbsUpCount');
                    thumbsUpElements.forEach(function (thumbsUpElement) {
                        thumbsUpElement.innerText = noteData.votes.thumbsUp;
                    });
                }
            });

            // Handle voting for thumbs down
            thumbsDownButton.addEventListener('click', function () {
                if (!hasUserVoted(noteId)) {
                    noteData.votes.thumbsDown++;
                    updateVoteInFirebase(tableId, noteId, noteData.votes);
                    saveVoteStatus(noteId); // Save user's vote to prevent multiple votes

                    // Update the UI with new vote counts
                    const thumbsDownElements = newCell.querySelectorAll('.thumbsDownCount');
                    thumbsDownElements.forEach(function (thumbsDownElement) {
                        thumbsDownElement.innerText = noteData.votes.thumbsDown;
                    });
                }
            });
        });
    });
}

// Update vote counts in Firebase
function updateVoteInFirebase(tableId, noteId, updatedVotes) {
    const noteRef = ref(database, `${tableId}/${noteId}`);
    update(noteRef, {
        votes: updatedVotes
    });
}

// Save vote status to localStorage
function saveVoteStatus(noteId) {
    let votedNotes = JSON.parse(localStorage.getItem("votedNotes")) || [];
    votedNotes.push(noteId);
    localStorage.setItem("votedNotes", JSON.stringify(votedNotes));
}

// Check if user has voted on a note
function hasUserVoted(noteId) {
    let votedNotes = JSON.parse(localStorage.getItem("votedNotes")) || [];
    return votedNotes.includes(noteId);
}

// Make addNote globally accessible
window.addNote = addNote;

window.onload = loadNotesFromFirebase;
