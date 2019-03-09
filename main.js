let WAGON_COUNT = 5, COMPARTMENTS_PER_WAGON = 10, COMPARTMENT_CAPACITY = 8;

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
