// const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;
// const STATIONS = ["București Nord", "Ploiești Vest", "Câmpina", "Sinaia", "Bușteni", "Azuga", "Predeal", "Brașov"];
// const STATIONS_NUMBER = STATIONS.length;

// Dep + Arr Select Option
(function () {
    const dep_st = document.getElementById("departure-station");
    const arr_st = document.getElementById("arrival-station");
    let option = document.createElement('option');
    option.value = 0;
    option.textContent = (STATIONS[0] === undefined) ? 1 : STATIONS[0];
    //option.onclick = "dep_arr();";
    dep_st.appendChild(option);
    for (let i = 1; i < STATIONS_NUMBER - 1; ++i) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = (STATIONS[i] === undefined) ? i + 1 : STATIONS[i];
        //option.onclick = "dep_arr();";
        dep_st.appendChild(option);
        option = document.createElement('option');
        option.value = i;
        option.textContent = (STATIONS[i] === undefined) ? i + 1 : STATIONS[i];
        arr_st.appendChild(option);
    }
    option = document.createElement('option');
    option.value = STATIONS_NUMBER - 1;
    option.textContent = (STATIONS[STATIONS_NUMBER - 1] === undefined) ? STATIONS_NUMBER : STATIONS[STATIONS_NUMBER - 1];
    arr_st.appendChild(option);
})();

function formatCompartment(compartmentEl, compartment, station) {
    let occupiedSeats = 0;
    for (let i = 0; i <= station; ++i) {
        occupiedSeats += compartment.reservedSeats[i];
    }
    compartmentEl.textContent = occupiedSeats + "/" + COMPARTMENT_CAPACITY;
    const percentFull = occupiedSeats / COMPARTMENT_CAPACITY;
    compartmentEl.style.background = "linear-gradient(to right, lightgray " + (percentFull * 100) 
                            + "%, white " + (percentFull * 100) + "%)";
}

function formatCompartmentOccupancy(compartment) {
    const occupiedSeats = COMPARTMENT_CAPACITY - compartment.freeSeats[0];
    return occupiedSeats + "/" + COMPARTMENT_CAPACITY;
}
function formatCompartmentGradient(compartment) {
    const percentFree = compartment.freeSeats[0] / COMPARTMENT_CAPACITY;
    const percentFull = 1 - percentFree;

    return "linear-gradient(to right, lightgray " + (percentFull * 100) +
        "%, white " + (percentFull * 100) + "%)";
}
// Display Train
(function (train) {
    const trainEl = document.getElementById("train");

    for (let i = 0; i < WAGON_COUNT; ++i) {
        const wagon = train.wagons[i];

        const wagonEl = document.createElement('div');
        wagonEl.className = "wagon";

        const wagonNumberEl = document.createElement('span');
        wagonNumberEl.textContent = "Vagon " + (i + 1) + ":";
        wagonEl.appendChild(wagonNumberEl);

        for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
            const compartment = wagon.compartments[j];
            const compartmentEl = document.createElement('span');
            compartmentEl.className = "compartment";
            compartmentEl.textContent = "0/" + COMPARTMENT_CAPACITY;
            wagonEl.appendChild(compartmentEl);
        }
        trainEl.appendChild(wagonEl);
    }
})(CFR);

// adding (if possible) a ticket for a group
function addTicket() {
    const groupSize = Number(document.getElementById("persons").value);
    const start = Number(document.getElementById("departure-station").selectedIndex);
    const finish = Number(document.getElementById("arrival-station").selectedIndex) + 1;

    const ticket = new Ticket(groupSize, start, finish);
    if (!CFR.addTicket(ticket)) {
        alert("Nu mai sunt locuri disponibile");
        return;
    }

    // Change train display
    let wagons = document.getElementById("train").childNodes;
    for (let i = 0; i < WAGON_COUNT; ++i) {
        let compartments = wagons[i].getElementsByClassName("compartment");
        for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
            compartments[j].textContent = formatCompartmentOccupancy(CFR.wagons[i].compartments[j]);
            compartments[j].style.background = formatCompartmentGradient(CFR.wagons[i].compartments[j]);
        }
    }
}

// adding (if possible) all the tickets from the textArea
function addAllTickets() {
    let groupSize, start, duration;

    document.getElementById("tickets").value.split('\n').forEach(function (element) {
        let now = element.trim().split(/\s+/);
        groupSize = parseInt(now[0]);
        start = parseInt(now[1]);
        duration = parseInt(now[2]);
        if (isNaN(groupSize) || groupSize < 1 || groupSize > GROUP_MAX_SIZE) { return; }
        if (isNaN(start) || start < 0 || start >= STATIONS_NUMBER - 1) { return; }
        if (isNaN(duration) || duration <= 0 || start + duration >= STATIONS_NUMBER) { return; }
        CFR.addTicket(new Ticket(groupSize, start, start + duration));
    });

    dep_arr();
}

// Select Dep - > Display some Arr + Train in station Dep
function dep_arr() {
    const dep_station = document.getElementById("departure-station").value;

    // Available arrival station
    document.getElementById("arrival-station").selectedIndex = dep_station;
    const arr_st = document.getElementById("arrival-station").childNodes;
    const lg = arr_st.length
    for (let i = 0; i < lg; ++i) {
        arr_st[i].style.display = (i < dep_station) ? "none" : "block";
    }

    // Change train display
    let wagons = document.getElementById("train").childNodes;
    for (let i = 0; i < WAGON_COUNT; ++i) {
        let compartments = wagons[i].getElementsByClassName("compartment");
        for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
            formatCompartment(compartments[j], CFR.wagons[i].compartments[j], dep_station);
        }
    }
}
