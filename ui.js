// const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;
// const STATIONS = ['București Nord', 'Ploiești Vest', 'Câmpina', 'Sinaia', 'Bușteni', 'Azuga', 'Predeal', 'Brașov'];
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

// Cancel Ticket Select Option
(function () {
    const c_wagon = document.getElementById("cancel-wagon");
    for (let i = 0; i < WAGON_COUNT; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + 1;
        c_wagon.appendChild(option);
    }

    const c_compartment = document.getElementById("cancel-compartment");
    for (let i = 0; i < COMPARTMENTS_PER_WAGON; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + 1;
        c_compartment.appendChild(option);
    }

    const c_seat = document.getElementById("cancel-seat");
    for (let i = 0; i < COMPARTMENT_CAPACITY; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + 1;
        c_seat.appendChild(option);
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
            const compartment = wagon.compartments[j];
            const compartmentEl = document.createElement('span');
            compartmentEl.className = "compartment";

            compartmentEl.textContent = formatCompartmentOccupancy(compartment);
            compartmentEl.style.background = formatCompartmentGradient(compartment);

            wagonEl.appendChild(compartmentEl);
        }
        trainEl.appendChild(wagonEl);
    }
}) (CFR);

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

function addAllTickets() {
    let groupSize, start, finish;
    
    document.getElementById("tickets").value.split('\n').forEach(function(element) {
        let now = element.split(' ');
        groupSize = parseInt(now[0]);
        start = parseInt(now[1]);
        finish = parseInt(now[2]);
        if (isNaN(groupSize) || groupSize < 1 || groupSize > GROUP_MAXIM_NUMBER) { return; }
        if (isNaN(start) || start < 0 || start >= STATIONS_NUMBER - 1) { return; }
        if (isNaN(finish) || finish <= 0 || finish >= STATIONS_NUMBER) { return; }
        CFR.addTicket(new Ticket(groupSize, start, finish)); 
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
            compartments[j].textContent = formatCompartmentOccupancy(CFR.wagons[i].compartments[j]);
            compartments[j].style.background = formatCompartmentGradient(CFR.wagons[i].compartments[j]);
        }
    }
}
