// ==========================================
// GET HTML ELEMENTS
// ==========================================

const dropZone = document.getElementById("dropZone");
const peopleContainer = document.querySelector(".people-container");

const peopleCount = document.getElementById("peopleCount");
const score = document.getElementById("score");

const addPersonBtn = document.getElementById("addPersonBtn");
const resetBtn = document.getElementById("resetBtn");

const objectName = document.getElementById("objectName");

const scoreTitle = document.getElementById("scoreTitle");
const scoreDescription = document.getElementById("scoreDescription");

const objectButtons = document.querySelectorAll(".object-btn");


// ==========================================
// VARIABLES
// ==========================================

let count = 0;
let draggedPerson = null;

let dragOffsetX = 0;
let dragOffsetY = 0;


// ==========================================
// INITIAL PEOPLE
// ==========================================

const initialPeople = document.querySelectorAll(".person");

initialPeople.forEach(person => {
    makePersonDraggable(person);
});


// ==========================================
// MAKE A PERSON DRAGGABLE
// ==========================================

function makePersonDraggable(person) {

    // Remember exactly where the mouse grabs the person
    person.addEventListener("mousedown", function(event) {

        const rect = person.getBoundingClientRect();

        dragOffsetX = event.clientX - rect.left;
        dragOffsetY = event.clientY - rect.top;
    });


    person.addEventListener("dragstart", function(event) {

        draggedPerson = person;

        event.dataTransfer.setData("text/plain", "person");

        person.style.opacity = "0.5";
    });


    person.addEventListener("dragend", function() {

        person.style.opacity = "1";

        draggedPerson = null;
    });
}


// ==========================================
// DRAGGING OVER DROP ZONE
// ==========================================

dropZone.addEventListener("dragover", function(event) {

    event.preventDefault();

    dropZone.classList.add("drag-over");
});


// ==========================================
// LEAVE DROP ZONE
// ==========================================

dropZone.addEventListener("dragleave", function() {

    dropZone.classList.remove("drag-over");
});


// ==========================================
// DROP PERSON INTO OBJECT
// ==========================================

dropZone.addEventListener("drop", function(event) {

    event.preventDefault();

    dropZone.classList.remove("drag-over");

    if (draggedPerson === null) {
        return;
    }


    // ==========================================
    // IF PERSON IS NOT ALREADY INSIDE
    // ==========================================

    if (!dropZone.contains(draggedPerson)) {

        dropZone.appendChild(draggedPerson);

        count++;

        updateCounter();

        showMessage();

        // Automatically create a replacement person
        createPerson();
    }


    // ==========================================
    // POSITION PERSON EXACTLY WHERE CURSOR IS
    // ==========================================

    const rect = dropZone.getBoundingClientRect();

    const x = event.clientX - rect.left - dragOffsetX;
    const y = event.clientY - rect.top - dragOffsetY;


    draggedPerson.style.position = "absolute";

    draggedPerson.style.left = `${x}px`;

    draggedPerson.style.top = `${y}px`;

    draggedPerson.style.margin = "0";

});


// ==========================================
// UPDATE COUNTER
// ==========================================

function updateCounter() {

    peopleCount.textContent = count;

    score.textContent = count;
}


// ==========================================
// FUNNY MESSAGES
// ==========================================

function showMessage() {

    if (count === 0) {

        scoreTitle.textContent =
            "It's looking pretty empty...";

        scoreDescription.textContent =
            "Start dragging people. We have absolutely no reason to be doing this.";
    }


    else if (count === 1) {

        scoreTitle.textContent =
            "One person.";

        scoreDescription.textContent =
            "Very reasonable. This won't last.";
    }


    else if (count === 2) {

        scoreTitle.textContent =
            "Two people.";

        scoreDescription.textContent =
            "Things are getting suspicious.";
    }


    else if (count < 5) {

        scoreTitle.textContent =
            "Okay...";

        scoreDescription.textContent =
            "This is starting to become unnecessary.";
    }


    else if (count < 10) {

        scoreTitle.textContent =
            "This is getting crowded.";

        scoreDescription.textContent =
            "There are definitely better things you could be doing.";
    }


    else if (count < 20) {

        scoreTitle.textContent =
            "At this point...";

        scoreDescription.textContent =
            "You're just collecting humans.";
    }


    else {

        scoreTitle.textContent =
            "BRO. THERE ARE TOO MANY PEOPLE.";

        scoreDescription.textContent =
            "Please stop. There is absolutely no reason for this.";
    }
}


// ==========================================
// CREATE A NEW PERSON
// ==========================================

function createPerson() {

    const person = document.createElement("div");

    person.classList.add("person", "draggable");

    person.setAttribute("draggable", "true");

    person.textContent = "🧍";


    // Add the new person to the people panel
    peopleContainer.appendChild(person);


    // Make the new person draggable
    makePersonDraggable(person);
}


// ==========================================
// ADD A NEW PERSON BUTTON
// ==========================================

addPersonBtn.addEventListener("click", function() {

    createPerson();

});


// ==========================================
// RESET BUTTON
// ==========================================

resetBtn.addEventListener("click", function() {

    // Find all people currently inside the object
    const peopleInside = dropZone.querySelectorAll(".person");


    peopleInside.forEach(person => {

        // Move them back to the people panel
        person.style.position = "static";

        person.style.left = "";
        person.style.top = "";

        person.style.margin = "";

        peopleContainer.appendChild(person);

    });


    // Reset count
    count = 0;

    updateCounter();

    showMessage();

});


// ==========================================
// OBJECT SELECTION
// ==========================================

objectButtons.forEach(button => {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        objectButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Make clicked button active
        button.classList.add("active");


        // Get selected object
        const selectedObject = button.dataset.object;


        changeObject(selectedObject);

    });

});


// ==========================================
// CHANGE OBJECT
// ==========================================

function changeObject(object) {

    if (object === "pool") {

        objectName.textContent = "Swimming Pool";

        dropZone.className = "drop-zone pool";

        scoreTitle.textContent =
            "Welcome to the pool.";

        scoreDescription.textContent =
            "Please leave your dignity at the door.";

    }


    else if (object === "elevator") {

        objectName.textContent = "Elevator";

        dropZone.className = "drop-zone elevator";

        scoreTitle.textContent =
            "Welcome to the elevator.";

        scoreDescription.textContent =
            "How many people before someone starts breathing manually?";

    }


    else if (object === "bathtub") {

        objectName.textContent = "Bathtub";

        dropZone.className = "drop-zone bathtub";

        scoreTitle.textContent =
            "A bathtub.";

        scoreDescription.textContent =
            "A completely normal place to put several people.";

    }


    else if (object === "bed") {

        objectName.textContent = "Bed";

        dropZone.className = "drop-zone bed";

        scoreTitle.textContent =
            "Sleepover time.";

        scoreDescription.textContent =
            "Sleepover has gotten slightly out of hand.";

    }


    else if (object === "car") {

        objectName.textContent = "Car";

        dropZone.className = "drop-zone car";

        scoreTitle.textContent =
            "Everyone's coming.";

        scoreDescription.textContent =
            "Road trip? More like human Tetris.";

    }


    else if (object === "airplane") {

        objectName.textContent = "Airplane";

        dropZone.className = "drop-zone airplane";

        scoreTitle.textContent =
            "Welcome aboard.";

        scoreDescription.textContent =
            "There is absolutely no legroom.";

    }

}