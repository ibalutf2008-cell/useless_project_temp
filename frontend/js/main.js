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
const statusMessage = document.getElementById("statusMessage");

const objectButtons = document.querySelectorAll(".object-btn");


// ==========================================
// VARIABLES
// ==========================================

let count = 0;
let draggedPerson = null;


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


    // If person is not already inside
    if (!dropZone.contains(draggedPerson)) {

        dropZone.appendChild(draggedPerson);

        count++;

        updateCounter();

        showMessage();
    }


    // Position the person where they were dropped

    const rect = dropZone.getBoundingClientRect();

    const x = event.clientX - rect.left - 35;
    const y = event.clientY - rect.top - 35;


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

        statusMessage.textContent =
            "Nobody has entered yet. They're probably smarter than us.";

    }

    else if (count === 1) {

        statusMessage.textContent =
            "One person. Very reasonable. This won't last.";

    }

    else if (count === 2) {

        statusMessage.textContent =
            "Two people. Things are getting suspicious.";

    }

    else if (count < 5) {

        statusMessage.textContent =
            "Okay... this is starting to become unnecessary.";

    }

    else if (count < 10) {

        statusMessage.textContent =
            "There are definitely better things you could be doing.";

    }

    else if (count < 20) {

        statusMessage.textContent =
            "At this point, you're just collecting humans.";

    }

    else {

        statusMessage.textContent =
            "BRO. THERE ARE TOO MANY PEOPLE.";
    }
}


// ==========================================
// ADD A NEW PERSON
// ==========================================

addPersonBtn.addEventListener("click", function() {

    const person = document.createElement("div");

    person.classList.add("person", "draggable");

    person.setAttribute("draggable", "true");

    person.textContent = "🧍";


    // Add person to people panel

    peopleContainer.appendChild(person);


    // Make the new person draggable

    makePersonDraggable(person);

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

        statusMessage.textContent =
            "Welcome to the pool. Please leave your dignity at the door.";

    }


    else if (object === "elevator") {

        objectName.textContent = "Elevator";

        dropZone.className = "drop-zone elevator";

        statusMessage.textContent =
            "How many people before someone starts breathing manually?";

    }


    else if (object === "bathtub") {

        objectName.textContent = "Bathtub";

        dropZone.className = "drop-zone bathtub";

        statusMessage.textContent =
            "A completely normal place to put several people.";

    }


    else if (object === "bed") {

        objectName.textContent = "Bed";

        dropZone.className = "drop-zone bed";

        statusMessage.textContent =
            "Sleepover has gotten slightly out of hand.";

    }


    else if (object === "car") {

        objectName.textContent = "Car";

        dropZone.className = "drop-zone car";

        statusMessage.textContent =
            "Road trip? More like human Tetris.";

    }


    else if (object === "airplane") {

        objectName.textContent = "Airplane";

        dropZone.className = "drop-zone airplane";

        statusMessage.textContent =
            "Welcome aboard. There is absolutely no legroom.";

    }

}