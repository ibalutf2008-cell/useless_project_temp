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
let dragClone = null;

let offsetX = 0;
let offsetY = 0;

let isDragging = false;


// =========================================
// CREATE PERSON
// =========================================

function createPerson() {

    const person = document.createElement("div");

    person.classList.add(
        "person",
        "draggable"
    );

    person.draggable = false;

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

    // -----------------------------------------
    // MOUSE DOWN
    // -----------------------------------------

    person.addEventListener("mousedown", function(event) {

        // Only use left mouse button
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();

        draggedPerson = person;

        isDragging = true;


        // -------------------------------------
        // FIND WHERE PERSON WAS GRABBED
        // -------------------------------------

        const rect =
            person.getBoundingClientRect();

        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;


        // -------------------------------------
        // CREATE FLOATING DRAG PERSON
        // -------------------------------------

        dragClone =
            person.cloneNode(true);

        dragClone.classList.add(
            "drag-clone"
        );


        // -------------------------------------
        // STYLE THE DRAG CLONE
        // -------------------------------------

        dragClone.style.position =
            "fixed";

        dragClone.style.left =
            `${event.clientX - offsetX}px`;

        dragClone.style.top =
            `${event.clientY - offsetY}px`;

        dragClone.style.width =
            "75px";

        dragClone.style.height =
            "75px";

        dragClone.style.fontSize =
            "80px";

        dragClone.style.display =
            "flex";

        dragClone.style.alignItems =
            "center";

        dragClone.style.justifyContent =
            "center";

        dragClone.style.zIndex =
            "99999";

        dragClone.style.pointerEvents =
            "none";

        dragClone.style.margin =
            "0";

        dragClone.style.padding =
            "0";

        dragClone.style.background =
            "transparent";

        dragClone.style.opacity =
            "1";

        dragClone.style.transform =
            "scale(1.15)";


        // -------------------------------------
        // ADD CLONE TO BODY
        // -------------------------------------

        document.body.appendChild(
            dragClone
        );


        // -------------------------------------
        // MAKE ORIGINAL FADED
        // -------------------------------------

        person.style.opacity =
            "0.25";


        // -------------------------------------
        // START LISTENING FOR MOUSE MOVEMENT
        // -------------------------------------

        document.addEventListener(
            "mousemove",
            dragMove
        );

        document.addEventListener(
            "mouseup",
            dragEnd
        );

    });

}


// =========================================
// MOVE DRAG CLONE
// =========================================

function dragMove(event) {

    if (!isDragging || !dragClone) {
        return;
    }


    // -----------------------------------------
    // MOVE THE FLOATING PERSON
    // -----------------------------------------

    dragClone.style.left =
        `${event.clientX - offsetX}px`;

    dragClone.style.top =
        `${event.clientY - offsetY}px`;


    // -----------------------------------------
    // CHECK IF OVER DROP ZONE
    // -----------------------------------------

    const rect =
        dropZone.getBoundingClientRect();


    const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;


    if (isInside) {

        dropZone.classList.add(
            "drag-over"
        );

    } else {

        dropZone.classList.remove(
            "drag-over"
        );

    }

}


// =========================================
// END DRAG
// =========================================

function dragEnd(event) {

    if (!isDragging || !draggedPerson) {
        return;
    }


    // -----------------------------------------
    // GET DROP ZONE POSITION
    // -----------------------------------------

    const rect =
        dropZone.getBoundingClientRect();


    // -----------------------------------------
    // CHECK WHETHER MOUSE IS INSIDE
    // -----------------------------------------

    const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;


    // -----------------------------------------
    // REMOVE DROP EFFECT
    // -----------------------------------------

    dropZone.classList.remove(
        "drag-over"
    );


    // -----------------------------------------
    // IF DROPPED INSIDE
    // -----------------------------------------

    if (isInside) {

        let x =
            event.clientX -
            rect.left -
            offsetX;

        let y =
            event.clientY -
            rect.top -
            offsetY;


        // -------------------------------------
        // PERSON SIZE
        // -------------------------------------

        const width =
            draggedPerson.offsetWidth;

        const height =
            draggedPerson.offsetHeight;


        // -------------------------------------
        // KEEP PERSON INSIDE OBJECT
        // -------------------------------------

        x =
            Math.max(
                0,
                Math.min(
                    x,
                    dropZone.clientWidth - width
                )
            );


        y =
            Math.max(
                0,
                Math.min(
                    y,
                    dropZone.clientHeight - height
                )
            );


        // -------------------------------------
        // MOVE ORIGINAL PERSON INTO DROP ZONE
        // -------------------------------------

        dropZone.appendChild(
            draggedPerson
        );


        draggedPerson.style.position =
            "absolute";

        draggedPerson.style.left =
            `${x}px`;

        draggedPerson.style.top =
            `${y}px`;

        draggedPerson.style.margin =
            "0";

        draggedPerson.style.padding =
            "0";

        draggedPerson.style.zIndex =
            "20";

        draggedPerson.style.opacity =
            "1";


        // -------------------------------------
        // CREATE NEW PERSON IN PANEL
        // -------------------------------------

        createPerson();


        // -------------------------------------
        // UPDATE EVERYTHING
        // -------------------------------------

        updateCount();

        updateMessage();

    }


    // -----------------------------------------
    // IF DROPPED OUTSIDE
    // -----------------------------------------

    else {

        // Put the original person
        // back normally

        draggedPerson.style.opacity =
            "1";

    }


    // -----------------------------------------
    // REMOVE DRAG CLONE
    // -----------------------------------------

    if (dragClone) {

        dragClone.remove();

        dragClone = null;

    }


    // -----------------------------------------
    // RESET VARIABLES
    // -----------------------------------------

    draggedPerson = null;

    isDragging = false;


    // -----------------------------------------
    // REMOVE EVENT LISTENERS
    // -----------------------------------------

    document.removeEventListener(
        "mousemove",
        dragMove
    );

    document.removeEventListener(
        "mouseup",
        dragEnd
    );

}


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
    // TOP COMMENT
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
    // STATUS MESSAGE
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


        // -------------------------------------
        // RETURN EVERYONE FROM OBJECT
        // -------------------------------------

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

                person.style.padding =
                    "";

                person.style.zIndex =
                    "";

                person.style.opacity =
                    "1";


                peopleContainer.appendChild(
                    person
                );

            }
        );


        // -------------------------------------
        // MAKE SURE THERE ARE EXACTLY 4
        // AVAILABLE
        // -------------------------------------

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


                // ---------------------------------
                // ACTIVE BUTTON
                // ---------------------------------

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


                // ---------------------------------
                // GET OBJECT
                // ---------------------------------

                const object =
                    button.dataset.object;


                // ---------------------------------
                // CHANGE OBJECT NAME
                // ---------------------------------

                objectName.textContent =
                    objectData[object].name;


                // ---------------------------------
                // CHANGE DROP ZONE CLASS
                // ---------------------------------

                dropZone.className =
                    `drop-zone ${object}`;


                // ---------------------------------
                // RETURN PEOPLE TO PANEL
                // ---------------------------------

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

                        person.style.padding =
                            "";

                        person.style.zIndex =
                            "";

                        person.style.opacity =
                            "1";


                        peopleContainer.appendChild(
                            person
                        );

                    }
                );


                // ---------------------------------
                // MAKE SURE THERE ARE 4
                // ---------------------------------

                let availablePeople =
                    peopleContainer.querySelectorAll(
                        ".person"
                    ).length;


                while (availablePeople < 4) {

                    createPerson();

                    availablePeople++;

                }


                // ---------------------------------
                // UPDATE
                // ---------------------------------

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