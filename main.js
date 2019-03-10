const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;
const STATIONS = [
    'Brașov', 'Predeal', 'Azuga', 'Bușteni',
    'Sinaia', 'Câmpina', 'Ploiești Vest', 'București Nord'
];
const STATIONS_NUMBER = STATIONS.length;
const ROUTE_LENGTH = STATIONS_NUMBER - 1;
const GROUP_MAX_SIZE = 5;

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
        this.maxGroupSize = new Array(ROUTE_LENGTH).fill(COMPARTMENT_CAPACITY);
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
        const groupSize = ticket.groupSize;

        // If we simply do not have enough seats anywhere in the train
        if (groupSize > this.getFreeSeats(start, finish)) {
            return false;
        }

        const maxGroupSize = this.getMaxGroupSize(start, finish);

        // Group needs to be placed in separate compartments
        if (groupSize > maxGroupSize) {
            const first = new Ticket(maxGroupSize, start, finish);
            const second = new Ticket(groupSize - maxGroupSize, start, finish);

            return this.addTicket(first) && this.addTicket(second);
        }

        const wagon = this.getEmptiestChild(groupSize, start, finish);
        const compartment = wagon.getBestCompartment(start, finish);

        if (compartment.getFreeSeats(start, finish) >= groupSize) {
            compartment.reserveSeats(groupSize, start, finish);
            ticket.compartment = compartment;
            return true;
        } else {
            return false;
        }
    }

    getFreeSeats(start, finish) {
        return this.freeSeats.slice(start, finish)
            .reduce((min, curr) => Math.min(min, curr));
    }

    /// Returns the child node with the most empty number of seats,
    /// which has at least groupSize free seats in the same compartment.
    getEmptiestChild(groupSize, start, finish) {
        return this.wagons.filter(wagon => wagon.getMaxGroupSize(start, finish) >= groupSize)
            .reduce((max, elem) => elem.getFreeSeats(start, finish) > max.getFreeSeats(start, finish) ? elem : max);
    }

    getMaxGroupSize(start, finish) {
        return this.maxGroupSize.slice(start, finish)
            .reduce((min, curr) => Math.min(min, curr));
    }

    updateMaxGroupSize(idx) {
        this.maxGroupSize[idx] = this.wagons.map(w => w.maxGroupSize[idx])
            .reduce((max, curr) => Math.max(max, curr));
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
        return this.freeSeats.slice(start, finish)
            .reduce(function (acc, value) { return Math.min(acc, value); })
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

    getMaxGroupSize(start, finish) {
        return this.maxGroupSize.slice(start, finish)
            .reduce((min, curr) => Math.min(min, curr));
    }

    updateMaxGroupSize(idx) {
        this.maxGroupSize[idx] = this.compartments.map(c => c.freeSeats[idx])
            .reduce((max, curr) => Math.max(max, curr));
    }
}

class Compartment {
    constructor(parent) {
        this.parent = parent;

        this.freeSeats = new Array(ROUTE_LENGTH).fill(COMPARTMENT_CAPACITY);
    }

    /// Returns the amount of available seats in this compartment on a section of the route.
    getFreeSeats(start, finish) {
        return this.freeSeats.slice(start, finish)
            .reduce(function (acc, value) { return Math.min(acc, value); });
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
                node.updateMaxGroupSize(i);
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
    testAddTicketAlmostFull();
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

function testAddTicketAlmostFull() {
    const train = new Train;
    for (let i = 0; i < WAGON_COUNT * COMPARTMENTS_PER_WAGON; ++i) {
        train.addTicket(new Ticket(COMPARTMENT_CAPACITY - 1, 0, STATIONS_NUMBER - 1));
    }

    assert(train.addTicket(new Ticket(1, 0, STATIONS_NUMBER - 1)), "Almost full train cannot add ticket");
}
