const train = document.getElementById("train");
let CFR = new Train

for (let i = 0; i < WAGON_COUNT; ++i) {
    const wagon = document.createElement('div');
    wagon.className = "wagon";

    const wagonNumber = document.createElement('span');
    wagonNumber.textContent = "Vagon " + (i + 1) + ":";
    wagon.appendChild(wagonNumber);

    for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
        const compartment = document.createElement('span');
        compartment.className = "compartment";
        compartment.textContent = "0/" + COMPARTMENT_CAPACITY;
        wagon.appendChild(compartment);
    }

    train.appendChild(wagon);
}

(function(){
    const c_wagon = document.getElementById("cancelled-wagon");
    for (let i = 0; i < WAGON_COUNT; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_wagon.appendChild(option);
    }

    const c_compartment = document.getElementById("cancelled-compartment");
    for (let i = 0; i < COMPARTMENTS_PER_WAGON; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_compartment.appendChild(option);
    }
  
    const c_seat = document.getElementById("cancelled-seat");
    for (let i = 0; i < COMPARTMENT_CAPACITY; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_seat.appendChild(option);
    }
})();
