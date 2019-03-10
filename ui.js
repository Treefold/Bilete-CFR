function getStationName(idx) {
    const stationName = STATIONS[idx];
    return stationName === undefined ? (idx + 1).toString() : stationName;
}

// Dep + Arr Select Option
(function () {
    const dep_st = document.getElementById("departure-station");
    const arr_st = document.getElementById("arrival-station");
    let option = document.createElement('option');
    option.value = 0;
    option.textContent = getStationName(0);
    //option.onclick = "dep_arr();";
    dep_st.appendChild(option);
    for (let i = 1; i < STATIONS_NUMBER - 1; ++i) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = getStationName(i);
        //option.onclick = "dep_arr();";
        dep_st.appendChild(option);
        option = document.createElement('option');
        option.value = i;
        option.textContent = getStationName(i);
        arr_st.appendChild(option);
    }
    option = document.createElement('option');
    option.value = STATIONS_NUMBER - 1;
    option.textContent = getStationName(STATIONS_NUMBER - 1);
    arr_st.appendChild(option);

    const routeSectionEl = document.getElementById("route-section");
    for (let i = 0; i < STATIONS_NUMBER - 1; ++i) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = getStationName(i) + " - " + getStationName(i + 1);
        routeSectionEl.appendChild(option);
    }
})();

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
            const compartmentEl = document.createElement('span');
            compartmentEl.className = "compartment";

            wagonEl.appendChild(compartmentEl);
        }
        trainEl.appendChild(wagonEl);
    }

    updateTrainDisplay();
})(CFR);

function addTicket() {
    const groupSize = Number(document.getElementById("persons").value);
    const start = Number(document.getElementById("departure-station").selectedIndex);
    const finish = Number(document.getElementById("arrival-station").selectedIndex) + 1;

    const ticket = new Ticket(groupSize, start, finish);
    if (!CFR.addTicket(ticket)) {
        alert("Nu mai sunt locuri disponibile");
        return;
    }

    updateTrainDisplay();
}

function formatCompartmentOccupancy(compartment, section) {
    const occupiedSeats = COMPARTMENT_CAPACITY - compartment.freeSeats[section];
    return occupiedSeats + "/" + COMPARTMENT_CAPACITY;
}

function formatCompartmentGradient(compartment, section) {
    const percentFree = compartment.freeSeats[section] / COMPARTMENT_CAPACITY;
    const percentFull = 1 - percentFree;

    return "linear-gradient(to right, lightgray " + (percentFull * 100) +
        "%, white " + (percentFull * 100) + "%)";
}

// Changes the train display to reflect the in-memory data
function updateTrainDisplay() {
    const routeSectionEl = document.getElementById("route-section");
    const section = parseInt(routeSectionEl.value);

    let wagons = document.getElementById("train").childNodes;
    for (let i = 0; i < WAGON_COUNT; ++i) {
        let compartments = wagons[i].getElementsByClassName("compartment");
        for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
            let wagon = CFR.wagons[i];
            let compartment = wagon.compartments[j];
            compartments[j].textContent = formatCompartmentOccupancy(compartment, section);
            compartments[j].style.background = formatCompartmentGradient(compartment, section);
        }
    }
}

function addAllTickets() {
    let groupSize, start, duration;

    try {
        let line = 0;
        const ticketsEl = document.getElementById("tickets");
        ticketsEl.value.split('\n').forEach(function (element) {
            line++;
            const lineMsg = "Linia " + line + ": ";
            let now = element.trim().split(/\s+/);
            groupSize = parseInt(now[0]);
            start = parseInt(now[1]) - 1;
            duration = parseInt(now[2]);
            if (isNaN(groupSize) || groupSize < 1 || groupSize > GROUP_MAX_SIZE) {
                throw Error(lineMsg + "Nu am înțeles dimensiunea grupului");
            }
            if (isNaN(start) || start < 0 || start >= STATIONS_NUMBER - 1) {
                throw Error(lineMsg + "Nu am înțeles stația de plecare")
            }
            if (isNaN(duration) || duration <= 0 || start + duration >= STATIONS_NUMBER) {
                throw Error(lineMsg + "Nu am înțeles numărul de stații");
            }
            CFR.addTicket(new Ticket(groupSize, start, start + duration));
        });

        ticketsEl.value = "";

        dep_arr();
    } catch (error) {
        alert(error);
    }
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

    updateTrainDisplay();
}
