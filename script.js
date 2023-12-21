// Selecting elements from the DOM
const addBox = document.querySelector(".add-box"), // Selecting an element with class "add-box"
  popupBox = document.querySelector(".popup-box"), // Selecting an element with class "popup-box"
  popupTitle = popupBox.querySelector("header p"), // Selecting the 'p' element within the header of popupBox
  closeIcon = popupBox.querySelector("header i"), // Selecting the 'i' element within the header of popupBox
  titleTag = popupBox.querySelector("input"), // Selecting the 'input' element within popupBox
  descTag = popupBox.querySelector("textarea"), // Selecting the 'textarea' element within popupBox
  addBtn = popupBox.querySelector("button"); // Selecting the 'button' element within popupBox

// Array of months
const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Retrieving notes from local storage or initializing an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Variables to manage update state and the ID of the note being updated
let isUpdate = false,
  updateId;

// Adding event listener for the addBox element
addBox.addEventListener("click", () => {
  // Updating the UI elements
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus(); // Setting focus to the title tag if the window width is greater than 660px
});

// Adding event listener for the closeIcon element
closeIcon.addEventListener("click", () => {
  // Resetting values and UI elements
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Function to display the notes
function showNotes() {
  // Checking if there are no notes
  if (!notes) return;
  // Removing all existing note elements
  document.querySelectorAll(".note").forEach(li => li.remove());
  // Iterating over each note and adding it to the UI
  notes.forEach((note, id) => {
    // Filtering description and creating the HTML for each note
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag); // Inserting the new note into the UI
  });
}
showNotes(); // Calling the showNotes function to display existing notes

// Function to show the menu
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    // Removing the menu if the click is not on the 'i' element or not the same element
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Function to delete a note
function deleteNote(noteId) {
  // Asking for confirmation before deleting the note
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  // Deleting the note with the provided ID
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes)); // Saving the updated notes to local storage
  showNotes(); // Updating the UI with the latest notes
}

// Function to update a note
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n'); // Reverting filtered description back to the original format
  // Setting the update state and updating UI elements
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title; // Setting the value of the title tag to the existing title
  descTag.value = description; // Setting the value of the description tag to the existing description
  popupTitle.innerText = "Update a Note"; // Updating the title of the popup
  addBtn.innerText = "Update Note"; // Updating the text of the button in the popup
}

// Adding event listener for the addBtn element
addBtn.addEventListener("click", e => {
  e.preventDefault(); // Preventing the default form submission behavior
  let title = titleTag.value.trim(), // Trimming the title value
    description = descTag.value.trim(); // Trimming the description value

  // Checking if either the title or the description is not empty
  if (title || description) {
    // Getting the current date
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    // Creating an object containing the note information
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      // Adding a new note to the notes array
      notes.push(noteInfo);
    } else {
      // Updating an existing note in the notes array
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes)); // Saving the updated notes to local storage
    showNotes(); // Updating the UI with the latest notes
    closeIcon.click(); // Simulating a click on the close icon to close the popup
  }
});

// Toggling between default and dark themes
let isDarkMode = false;

// Function to toggle between themes
function toggleTheme() {
    const body = document.querySelector("body");

    if (isDarkMode) {
        body.style.background = "#0068ca";
        body.style.color = "#000000";
      
    } else {
        body.style.background = "#1a1a1a";
        body.style.color = "#000000";
        
    }
    isDarkMode = !isDarkMode;
}

// Event listener for the theme toggle button
const themeToggleBtn = document.getElementById("theme-toggle-btn");
themeToggleBtn.addEventListener("click", toggleTheme);
