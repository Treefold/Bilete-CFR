const train = document.getElementById("train");
let CFR = new Train

for (let i = 0; i < WAGON_COUNT; ++i) {
    const wagon = document.createElement("div");
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
