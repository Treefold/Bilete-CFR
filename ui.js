(function () {
    const dep_st = document.getElementById("departure-station");
    const arr_st = document.getElementById("arrival-station");
    let option = document.createElement('option');
    option.value = 0;
    option.innerHTML = (STATIONS[0] === undefined) ? 1 : STATIONS[0];
    //option.onclick = "dep_arr();";
    dep_st.appendChild(option);
    for (let i = 1; i < STATIONS_NUMBER - 1; ++i) {
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = (STATIONS[i] === undefined) ? i + 1 : STATIONS[i];
        //option.onclick = "dep_arr();";
        dep_st.appendChild(option);
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = (STATIONS[i] === undefined) ? i + 1 : STATIONS[i];
        arr_st.appendChild(option);
    }
    option = document.createElement('option');
    option.value = STATIONS_NUMBER - 1;
    option.innerHTML = (STATIONS[STATIONS_NUMBER - 1] === undefined) ? STATIONS_NUMBER : STATIONS[STATIONS_NUMBER - 1];
    arr_st.appendChild(option);
})();

function formatCompartmentOccupancy(compartment) {
    const occupiedSeats = COMPARTMENT_CAPACITY - compartment.freeSeats;
    return occupiedSeats + "/" + COMPARTMENT_CAPACITY;
}

function formatCompartmentGradient(compartment) {
    const percentFree = compartment.freeSeats / COMPARTMENT_CAPACITY;
    const percentFull = 1 - percentFree;

    return "linear-gradient(to right, lightgray " + (percentFull * 100) +
        "%, white " + (percentFull * 100) + "%)";
}

function renderTrain(train) {
    const trainEl = document.getElementById("train");

    for (let i = 0; i < WAGON_COUNT; ++i) {
        const wagon = train.root.children[i];

        const wagonEl = document.createElement('div');
        wagonEl.className = "wagon";

        const wagonNumberEl = document.createElement('span');
        wagonNumberEl.textContent = "Vagon " + (i + 1) + ":";
        wagonEl.appendChild(wagonNumberEl);

        for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
            const compartment = wagon.children[j];
            const compartmentEl = document.createElement('span');
            compartmentEl.className = "compartment";

            compartment.callback = function() {
                compartmentEl.textContent = formatCompartmentOccupancy(compartment);
                compartmentEl.style.background = formatCompartmentGradient(compartment);
            };
            compartment.callback();

            wagonEl.appendChild(compartmentEl);
        }

        trainEl.appendChild(wagonEl);
    }
}

renderTrain(CFR);

(function () {
    const c_wagon = document.getElementById("cancel-wagon");
    for (let i = 0; i < WAGON_COUNT; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_wagon.appendChild(option);
    }

    const c_compartment = document.getElementById("cancel-compartment");
    for (let i = 0; i < COMPARTMENTS_PER_WAGON; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_compartment.appendChild(option);
    }

    const c_seat = document.getElementById("cancel-seat");
    for (let i = 0; i < COMPARTMENT_CAPACITY; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_seat.appendChild(option);
    }
})();

function dep_arr() {
    const dep_station = document.getElementById("departure-station").value;
    document.getElementById("arrival-station").selectedIndex = dep_station;
    const arr_st = document.getElementById("arrival-station").childNodes;
    const lg = arr_st.length
    for (let i = 0; i < lg; ++i) {
        arr_st[i].style.visibility = (i < dep_station) ? "hidden" : "visible";
    }
}
