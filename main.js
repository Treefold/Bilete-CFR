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
            this.seatAvailability.push(1);
        }
    }
    get freeSeats() {
        return this._freeSeats;
    }
    set freeSeats(value) {
        if (this._freeSeats < 0 || this._freeSeats > 8) {
            throw Error("Wrong alocation of seats in compartment!");
        }
        this._freeSeats += value;
    }
    deleteSeat(s) {
        if (this.seatAvability[s] == 1) {
            alert("Bilet inexistent! Acest loc este deja liber.");
        } else {
            this.seatAvability[s] = 1;
            this._freeSeats += 1;
        }
    }
}

class TreeNode {
    constructor(fs) {
        this.parent = null;
        this.children = [];
        this.freeSeats = (fs === undefined) ? COMPARTMENT_CAPACITY : fs;
    }
    /// Adds a new child (node) to this node, the parameter is the child
    addChild(child) {
        this.children.push(child);
        child.parent = this;
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
    deleteSeat(c, s) { this.childNodes[c].deleteSeat(s); }
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
    deleteSeat(w, c, s) { this.childNodes[w].deleteSeat(c, s); }
}

//// functions

let CFR = new Train();
function cancelTicket() {
    const c_wagon = document.getElementById("cancel-wagon");
    const c_compartment = document.getElementById("cancel-compartment");
    const c_seat = document.getElementById("cancel-seat");
    CFR.deleteSeat(c_wagon, c_compartment, c_seat);
};

//// Unit tests for the classes in the project

runTests();

function runTests() {
    testNodeChild();
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
