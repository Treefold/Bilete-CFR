const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;
const STATIONS = ['București Nord', 'Ploiești Vest', 'Câmpina', 'Sinaia', 'Bușteni', 'Azuga', 'Predeal', 'Brașov'];
const STATIONS_NUMBER = STATIONS.length;

///// classes

class Ticket {
    constructor(start, finish) {
        this.compartment = null;
        this.seat = null;
        this.start = start;
        this.finish = finish;
    }
}

class Compartment {
    constructor() {
        this.parent = null;
        this._freeSeats = COMPARTMENT_CAPACITY;
        this.seatAvailability = [];
        for (let i = 0; i < COMPARTMENT_CAPACITY; ++i) {
            this.seatAvailability[i] = 1;
        }
    }
    get freeSeats() {
        return this._freeSeats;
    }
    set freeSeats(value) {
        if (value < 0 || value > COMPARTMENT_CAPACITY) {
            throw Error("Wrong alocation of seats in compartment!");
        }

        const diff = value - this._freeSeats;
        this._freeSeats = value;

        // Update the free seat count of the parents
        let node = this.parent;
        while (node != null) {
            node.freeSeats += diff;
            node = node.parent;
        }
    }
    deleteSeat(s) {
        if (this.seatAvailability[s] == 1) {
            alert("Bilet inexistent! Acest loc este deja liber.");
        } else {
            this.seatAvailability[s] = 1;
            this._freeSeats += 1;
            if (this.parent != null) {
                this.parent.freeSeats += 1; // wagon.freeSeats += 1
                if (this.parent.parent != null) {
                    this.parent.parent.freeSeats += 1; // train.freeSeats += 1
                }
            }
        }
    }
}

class TreeNode {
    constructor() {
        this.parent = null;
        this.children = [];
        this.freeSeats = 0;
    }
    /// Adds a new child (node) to this node, the parameter is the child
    addChild(child) {
        this.children.push(child);
        child.parent = this;
        this.freeSeats += child.freeSeats;
    }
    /// Returns the child node with the most empty number of seats.
    getEmptiestChild() {
        let min = this.children[0].freeSeats;
        let child = this.children[0];
        let lg = this.children.length;
        for (let i = 1; i < lg; ++i) {
            if (this.children[i].freeSeats < min) {
                min = this.children[i].freeSeats;
                child = this.children[i];
            }
        }
        return child;
    }
}

class Train {
    constructor() {
        let root = new TreeNode;
        for (let i = 0; i < WAGON_COUNT; ++i) {
            let wagon = new TreeNode;
            for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
                let comp = new Compartment;
                wagon.addChild(comp);
            }
            root.addChild(wagon);
        }
        this.root = root;
    }
    get treeRoot() { return this.root; }
}

//// functions

const CFR = new Train;

function cancelTicket() {
    const c_wagon = document.getElementById("cancel-wagon").value;
    const c_compartment = document.getElementById("cancel-compartment").value;
    const c_seat = document.getElementById("cancel-seat").value;
    CFR.root.children[c_wagon].children[c_seat].deleteSeat(Number(c_seat));
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
    const node = new TreeNode;
    node.addChild(new TreeNode);

    assert(node.children[0].parent === node, "Child's parent is not correct");
}

function testFreeSeats() {
    const train = new Train;
    const root = train.root;

    const TOTAL_SEATS = WAGON_COUNT * COMPARTMENTS_PER_WAGON * COMPARTMENT_CAPACITY;

    assert(root.freeSeats === TOTAL_SEATS,
        "Train does not have right number of seats");

    root.children[2].children[5].freeSeats -= 5;
    root.children[4].children[2].freeSeats -= 7;

    assert(root.freeSeats === TOTAL_SEATS - 12,
        "Reserving seats does not work");

    root.children[4].children[2].freeSeats += 5;

    assert(root.freeSeats === TOTAL_SEATS - 7,
        "Freeing seats does not work");
}
