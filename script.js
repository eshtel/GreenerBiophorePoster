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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Load notes from Firebase and display them
function loadNotesFromFirebase() {
    const tableIds = ['table1', 'table2', 'table3', 'table4'];

    tableIds.forEach(function (tableId) {
        const tableRef = database.ref(tableId);
        tableRef.on('child_added', function (snapshot) {
            const noteData = snapshot.val();
            const noteId = snapshot.key;
            updateNoteInUI(tableId, noteData, noteId); // Update UI with new note
        });
    });
}

// Function to update the note in the UI
function updateNoteInUI(tableId, noteData, noteId) {
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
}

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
            const formattedDate = now.toLocaleString(); // Format date as needed

            // Save note to Firebase
            saveNoteToFirebase(tableId, noteText, formattedDate);

            // Clear the textarea after submission
            textarea.value = '';
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
        votes: {
            thumbsUp: 0,
            thumbsDown: 0
        }
    };

    // Save the note under the correct tableId in Firebase
    const tableRef = database.ref(tableId);
    const newNoteRef = tableRef.push(noteData); // Firebase will automatically generate a unique key
}

// Function to save the vote to Firebase
function saveVoteToFirebase(tableId, thumbsUpCount, thumbsDownCount, noteId) {
    const noteRef = database.ref(`${tableId}/${noteId}`);
    noteRef.update({
        thumbsUp: thumbsUpCount,
        thumbsDown: thumbsDownCount
    });
}

// Initialize the page and load existing notes from Firebase
window.onload = function() {
    loadNotesFromFirebase();
};
