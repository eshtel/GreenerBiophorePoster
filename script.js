// Function to add a note to a specific table
function addNote(tableId) {
    // Get the table body element by its table ID
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
            
            // Create vote buttons (Thumbs Up and Thumbs Down)
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
            voteCount.innerHTML = 'Votes: <span class="thumbsUpCount">0</span> 👍 / <span class="thumbsDownCount">0</span> 👎';
            voteContainer.appendChild(voteCount);

            // Append the vote container to the note cell
            newCell.appendChild(voteContainer);

            let thumbsUpCount = 0;
            let thumbsDownCount = 0;

            // Thumbs Up button event listener
            thumbsUpButton.addEventListener('click', function () {
                thumbsUpCount++;
                const thumbsUpElements = newCell.querySelectorAll('.thumbsUpCount');
                thumbsUpElements.forEach(function (thumbsUpElement) {
                    thumbsUpElement.innerText = thumbsUpCount;
                });
            });

            // Thumbs Down button event listener
            thumbsDownButton.addEventListener('click', function () {
                thumbsDownCount++;
                const thumbsDownElements = newCell.querySelectorAll('.thumbsDownCount');
                thumbsDownElements.forEach(function (thumbsDownElement) {
                    thumbsDownElement.innerText = thumbsDownCount;
                });
            });
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
