const WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8, STATIONS_NUMBER = 8;
const STATIONS = ['București Nord','Ploiești Vest','Câmpina','Sinaia','Bușteni','Azuga','Predeal','Brașov'];
//const CFR = new train;

/////assert

function assert(bool, mess) {
    if (bool === false)
        throw Error(mess);
}

/////classes

class TreeNode {
    constructor(fs) {
        this.parent = null;
        this.children = [];
        this.freeSeats = (fs === undefined) ? COMPARTMENT_CAPACITY : fs;
    }
    ///adds a new child (node) to this node, the parameter is the child
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    getEmptiestChild(){
        let min = this.children[0].freeSeats;
        let child = this.children[0];
        let lg = this.children.length;
        for(let i = 1; i < lg; ++i){
            if(this.children[i].freeSeats < min)
            {
                min = this.children[i].freeSeats;
                child = this.children[i];
            }
        }
        return child;
    }
}

class Compartment {
    constructor() {
        this.parent = null;
        this._freeSeats = COMPARTMENT_CAPACITY;
        this.takenSeats = [];
    }
    get freeSeats(){
        return this._freeSeats;
    }
    set freeSeats(value) {
        this._freeSeats += value;
        if (this._freeSeats < 0 || this._freeSeats > 8)
            throw Error("Wrong alocation of seats in compartment!");
    }


    get nrSeats() {
        return this.freeSeats;
    }
}

class Ticket {
    constructor(start, finish) {
        this.Compartment = undefined;
        this.Seat = undefined;
        this.start = start;
        this.finish = finish;
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
}

function cancelTicket() {
    const c_wagon = document.getElementById("cancel-wagon");
    const c_compartment = document.getElementById("cancel-compartment");
    const c_seat = document.getElementById("cancel-seat");
}
