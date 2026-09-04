// =========================================
// ELEMENTS
// =========================================

const dropZone = document.getElementById("dropZone");
const peopleContainer = document.querySelector(".people-container");

const addPersonBtn = document.getElementById("addPersonBtn");
const resetBtn = document.getElementById("resetBtn");

const peopleCount = document.getElementById("peopleCount");

const objectName = document.getElementById("objectName");

const scoreTitle = document.getElementById("scoreTitle");
const scoreDescription = document.getElementById("scoreDescription");

const statusMessage = document.getElementById("statusMessage");


// =========================================
// VARIABLES
// =========================================

let draggedPerson = null;

let offsetX = 0;
let offsetY = 0;


// =========================================
// CREATE PERSON
// =========================================

function createPerson() {

    const person = document.createElement("div");

    person.classList.add(
        "person",
        "draggable"
    );

    person.draggable = true;

    person.textContent = "🧍";

    peopleContainer.appendChild(person);

    makeDraggable(person);
}


// =========================================
// CREATE INITIAL 4 PEOPLE
// =========================================

for (let i = 0; i < 4; i++) {

    createPerson();

}


// =========================================
// MAKE PERSON DRAGGABLE
// =========================================

function makeDraggable(person) {

    person.addEventListener("dragstart", function(event) {

        draggedPerson = person;


        // Find where inside the person
        // the mouse grabbed
        const rect =
            person.getBoundingClientRect();


        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;


        // Required for drag and drop
        event.dataTransfer.setData(
            "text/plain",
            "person"
        );


        // Keep the normal browser
        // drag preview visible
        person.classList.add(
            "being-dragged"
        );

    });


    person.addEventListener("dragend", function() {

        person.classList.remove(
            "being-dragged"
        );

        dropZone.classList.remove(
            "drag-over"
        );

        draggedPerson = null;

    });
}


// =========================================
// DRAG OVER
// =========================================

dropZone.addEventListener("dragover", function(event) {

    event.preventDefault();

    dropZone.classList.add(
        "drag-over"
    );

});


// =========================================
// DRAG ENTER
// =========================================

dropZone.addEventListener("dragenter", function(event) {

    event.preventDefault();

    dropZone.classList.add(
        "drag-over"
    );

});


// =========================================
// DRAG LEAVE
// =========================================

dropZone.addEventListener("dragleave", function(event) {

    if (
        !dropZone.contains(
            event.relatedTarget
        )
    ) {

        dropZone.classList.remove(
            "drag-over"
        );

    }

});


// =========================================
// DROP
// =========================================

dropZone.addEventListener("drop", function(event) {

    event.preventDefault();

    if (!draggedPerson) {
        return;
    }


    // =====================================
    // REMOVE DRAG OVER EFFECT
    // =====================================

    dropZone.classList.remove(
        "drag-over"
    );


    // =====================================
    // GET DROP ZONE POSITION
    // =====================================

    const rect =
        dropZone.getBoundingClientRect();


    // =====================================
    // CALCULATE DROP POSITION
    // =====================================

    let x =
        event.clientX -
        rect.left -
        offsetX;

    let y =
        event.clientY -
        rect.top -
        offsetY;


    // =====================================
    // ACCOUNT FOR SCALE
    // =====================================

    const scaleX =
        dropZone.clientWidth /
        rect.width;

    const scaleY =
        dropZone.clientHeight /
        rect.height;


    x *= scaleX;

    y *= scaleY;


    // =====================================
    // PERSON SIZE
    // =====================================

    const width =
        draggedPerson.offsetWidth;

    const height =
        draggedPerson.offsetHeight;


    // =====================================
    // KEEP PERSON INSIDE OBJECT
    // =====================================

    if (x < 0) {

        x = 0;

    }


    if (y < 0) {

        y = 0;

    }


    if (
        x + width >
        dropZone.clientWidth
    ) {

        x =
            dropZone.clientWidth -
            width;

    }


    if (
        y + height >
        dropZone.clientHeight
    ) {

        y =
            dropZone.clientHeight -
            height;

    }


    // =====================================
    // MOVE PERSON INTO OBJECT
    // =====================================

    dropZone.appendChild(
        draggedPerson
    );


    // =====================================
    // POSITION PERSON
    // =====================================

    draggedPerson.style.position =
        "absolute";

    draggedPerson.style.left =
        `${x}px`;

    draggedPerson.style.top =
        `${y}px`;

    draggedPerson.style.margin =
        "0";

    draggedPerson.style.zIndex =
        "20";


    // =====================================
    // CLEAR DRAGGED PERSON
    // =====================================

    draggedPerson = null;


    // =====================================
    // AUTOMATICALLY REPLENISH
    // =====================================

    createPerson();


    // =====================================
    // UPDATE COUNTER
    // =====================================

    updateCount();


    // =====================================
    // UPDATE MESSAGES
    // =====================================

    updateMessage();

});


// =========================================
// UPDATE PEOPLE COUNT
// =========================================

function updateCount() {

    const count =
        dropZone.querySelectorAll(
            ".person"
        ).length;


    peopleCount.textContent =
        count;

}


// =========================================
// UPDATE MESSAGES
// =========================================

function updateMessage() {

    const count =
        dropZone.querySelectorAll(
            ".person"
        ).length;


    // =====================================
    // TOP COMMENT BOX
    // =====================================

    if (count === 0) {

        scoreTitle.textContent =
            "It's looking pretty empty...";

        scoreDescription.textContent =
            "Start dragging people. We have absolutely no reason to be doing this.";

    }

    else if (count === 1) {

        scoreTitle.textContent =
            "Well... that's one.";

        scoreDescription.textContent =
            "Surely we can fit more people in there.";

    }

    else if (count < 5) {

        scoreTitle.textContent =
            "Now we're getting somewhere.";

        scoreDescription.textContent =
            `${count} people are currently inside. This experiment is becoming slightly concerning.`;

    }

    else if (count < 10) {

        scoreTitle.textContent =
            "Okay, that's quite a few.";

        scoreDescription.textContent =
            `${count} people. Someone should probably stop this.`;

    }

    else {

        scoreTitle.textContent =
            "WHY ARE THERE SO MANY PEOPLE?!";

        scoreDescription.textContent =
            `${count} people are inside. We have officially lost the plot.`;

    }


    // =====================================
    // BOTTOM STATUS MESSAGE
    // =====================================

    if (count === 0) {

        statusMessage.textContent =
            "Nobody has entered yet. They're probably smarter than us.";

    }

    else if (count === 1) {

        statusMessage.textContent =
            "One person. This is already getting ridiculous.";

    }

    else if (count < 5) {

        statusMessage.textContent =
            `${count} people. We are making progress for absolutely no reason.`;

    }

    else {

        statusMessage.textContent =
            `${count} people. Please stop.`;

    }

}


// =========================================
// ADD PERSON BUTTON
// =========================================

addPersonBtn.addEventListener(
    "click",
    function() {

        createPerson();

    }
);


// =========================================
// RESET
// =========================================

resetBtn.addEventListener(
    "click",
    function() {

        // Get everyone currently
        // inside the object
        const people =
            dropZone.querySelectorAll(
                ".person"
            );


        people.forEach(
            function(person) {

                person.style.position =
                    "";

                person.style.left =
                    "";

                person.style.top =
                    "";

                person.style.margin =
                    "";

                person.style.zIndex =
                    "";


                peopleContainer.appendChild(
                    person
                );

            }
        );


        // =====================================
        // MAKE SURE THERE ARE 4 AVAILABLE
        // =====================================

        let availablePeople =
            peopleContainer.querySelectorAll(
                ".person"
            ).length;


        while (availablePeople < 4) {

            createPerson();

            availablePeople++;

        }


        updateCount();

        updateMessage();

    }
);


// =========================================
// OBJECT SELECTION
// =========================================

const objectButtons =
    document.querySelectorAll(
        ".object-btn"
    );


const objectData = {

    pool: {
        name: "Swimming Pool"
    },

    elevator: {
        name: "Elevator"
    },

    bathtub: {
        name: "Bathtub"
    },

    bed: {
        name: "Bed"
    },

    car: {
        name: "Car"
    },

    airplane: {
        name: "Airplane"
    }

};


// =========================================
// OBJECT BUTTONS
// =========================================

objectButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {


                // =================================
                // ACTIVE BUTTON
                // =================================

                objectButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                // =================================
                // GET OBJECT
                // =================================

                const object =
                    button.dataset.object;


                // =================================
                // CHANGE OBJECT NAME
                // =================================

                objectName.textContent =
                    objectData[object].name;


                // =================================
                // CHANGE OBJECT CLASS
                // =================================

                dropZone.className =
                    `drop-zone ${object}`;


                // =================================
                // RETURN PEOPLE TO PANEL
                // =================================

                const people =
                    dropZone.querySelectorAll(
                        ".person"
                    );


                people.forEach(
                    function(person) {

                        person.style.position =
                            "";

                        person.style.left =
                            "";

                        person.style.top =
                            "";

                        person.style.margin =
                            "";

                        person.style.zIndex =
                            "";


                        peopleContainer.appendChild(
                            person
                        );

                    }
                );


                // =================================
                // MAKE SURE 4 ARE AVAILABLE
                // =================================

                let availablePeople =
                    peopleContainer.querySelectorAll(
                        ".person"
                    ).length;


                while (availablePeople < 4) {

                    createPerson();

                    availablePeople++;

                }


                // =================================
                // UPDATE
                // =================================

                updateCount();

                updateMessage();


                statusMessage.textContent =
                    "New object selected. Time to make questionable decisions.";

            }
        );

    }
);


// =========================================
// INITIAL UPDATE
// =========================================

updateCount();

updateMessage();