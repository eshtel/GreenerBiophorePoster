// Firebase configuration (replace this with your Firebase config object)
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

            // Add the note with the timestamp and background color
            newCell.innerHTML = `${noteText} <span style="font-size: 0.8em; color: gray;">(${formattedDate})</span>`;

            // Set a background color for the note
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
        votes: {
            thumbsUp: 0,
            thumbsDown: 0
        }
    };

    // Save the note under the correct tableId in Firebase
    const tableRef = database.ref(tableId);
    tableRef.push(noteData); // Firebase will automatically generate a unique key
}

// Load notes from Firebase and display them
function loadNotesFromFirebase() {
    const tableIds = ['table1', 'table2', 'table3', 'table4'];

    tableIds.forEach(function (tableId) {
        const tableRef = database.ref(tableId);
        tableRef.on('child_added', function (snapshot) {
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

// Call this function when the page loads to load existing notes from Firebase
window.onload = function() {
    loadNotesFromFirebase();
};
