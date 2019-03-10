const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;
const STATIONS = ['București Nord', 'Ploiești Vest', 'Câmpina', 'Sinaia', 'Bușteni', 'Azuga', 'Predeal', 'Brașov'];
const STATIONS_NUMBER = STATIONS.length;
const ROUTE_LENGTH = STATIONS_NUMBER - 1;

///// classes

class Ticket {
    constructor(groupSize, start, finish) {
        this.groupSize = groupSize;
        this.compartment = null;
        this.start = start;
        this.finish = finish;
    }
}

class Train {
    constructor() {
        this.wagons = [];
        this.freeSeats = new Array(ROUTE_LENGTH).fill(0);
        for (let i = 0; i < WAGON_COUNT; ++i) {
            const wagon = new Wagon(this);
            this.wagons.push(wagon);
            for (let j = 0; j < ROUTE_LENGTH; ++j) {
                this.freeSeats[j] += wagon.freeSeats[j];
            }
        }
    }

    addTicket(ticket) {
        const start = ticket.start;
        const finish = ticket.finish;

        const wagon = this.getEmptiestChild(start, finish);
        const compartment = wagon.getBestCompartment(start, finish);

        if (compartment.getFreeSeats(start, finish) > ticket.groupSize) {
            compartment.reserveSeats(ticket.groupSize, start, finish);
            ticket.compartment = compartment;
        } else {
            alert("Nu mai sunt locuri disponibile");
        }
    }

    /// Returns the child node with the most empty number of seats.
    getEmptiestChild(start, finish) {
        return this.wagons.reduce(function (max, elem) {
            return elem.getFreeSeats(start, finish) > max.getFreeSeats(start, finish) ? elem : max;
        });
    }
}

class Wagon {
    constructor(parent) {
        this.parent = parent;
        this.freeSeats = new Array(ROUTE_LENGTH).fill(0);
        this.maxGroupSize = new Array(ROUTE_LENGTH).fill(COMPARTMENT_CAPACITY);
        this.compartments = [];
        for (let i = 0; i < COMPARTMENTS_PER_WAGON; ++i) {
            const compartment = new Compartment(this);
            this.compartments.push(compartment);
            for (let j = 0; j < ROUTE_LENGTH; ++j) {
                this.freeSeats[j] += compartment.freeSeats[j];
            }
        }
    }

    getFreeSeats(start, finish) {
        return this.freeSeats.slice(start, finish).reduce(Math.min)
    }

    getBestCompartment(start, finish) {
        return this.compartments.reduce(function (best, comp) {
            if (best.getScore(start, finish) > comp.getScore(start, finish)) {
                return best;
            } else {
                return comp;
            }
        });
    }
}

class Compartment {
    constructor(parent) {
        this.parent = parent;

        this.freeSeats = new Array(ROUTE_LENGTH).fill(COMPARTMENT_CAPACITY);
    }

    /// Returns the amount of available seats in this compartment on a section of the route.
    getFreeSeats(start, finish) {
        return this.freeSeats.slice(start, finish).reduce(Math.min);
    }

    reserveSeats(num, start, finish) {
        for (let i = start; i < finish; ++i) {
            if (this.freeSeats[i] < num) {
                throw Error("Cannot reserve seat");
            }

            this.freeSeats[i] -= num;

            // Update the free seat count of the parents
            let node = this.parent;
            while (node != null) {
                node.freeSeats[i] -= num;
                node = node.parent;
            }
        }
    }

    getScore(start, finish) {
        let total = 0;
        for (let i = start; i < finish; ++i) {
            total += this.freeSeats[i];
        }
        return total;
    }
}

//// functions

const CFR = new Train;

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

function cancelTicket() {
    const c_wagon = document.getElementById("cancel-wagon").value;
    const c_compartment = document.getElementById("cancel-compartment").value;
    const c_seat = document.getElementById("cancel-seat").value;
    if (CFR.root.children[c_wagon].children[c_compartment].deleteSeat(Number(c_seat))) {
        let el = document.getElementById("train").childNodes[c_wagon].getElementsByClassName("compartment")[c_compartment];
        el.textContent = formatCompartmentOccupancy(CFR.root.children[c_wagon].children[c_compartment]);
        el.style.background = formatCompartmentGradient(CFR.root.children[c_wagon].children[c_compartment]);
    }
};

//// Unit tests for the classes in the project

runTests();

function runTests() {
    testNodeChild();
    testFreeSeats();
}

/// Ensures that a given condition is true.
/// Otherwise throws an error.
function assert(condition, message) {
    if (!condition) {
        throw Error(message);
    }
}

function testNodeChild() {
    const train = new Train;

    assert(train.wagons[0].parent === train, "Child's parent is not correct");
}

function testFreeSeats() {
    const train = new Train;

    const TOTAL_SEATS = WAGON_COUNT * COMPARTMENTS_PER_WAGON * COMPARTMENT_CAPACITY;

    assert(train.freeSeats[0] === TOTAL_SEATS,
        "Train does not have right number of seats");

    train.wagons[2].compartments[5].reserveSeats(5, 1, 3);
    train.wagons[4].compartments[2].reserveSeats(7, 0, 5);

    assert(train.freeSeats[1] === TOTAL_SEATS - 12,
        "Reserving seats does not work");
}
