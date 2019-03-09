class TreeNode{
    constructor(info){
        this.parent = null;
        this.children = [];
    }

    addChild(child){
        this.children.push(child);
    }
}

class Compartment {
    constructor(){
        this.parent = null;
        this.freeSeats = 0;
    }
    get nrSeats(){
        return this.freeSeats;
    }
}

class Ticket{
    constructor(start, finish){
        this.Compartment = undefined;
        this.start = start;
        this.finish = finish;
    }
}

class Train{
    constructor(){
        let mainNode = new TreeNode;

    }
}

let root = new TreeNode();

for(let i = 0; i < 5; ++i)
{
    let wagon = new TreeNode;
    for(let j = 0; j < 10; ++j)
    {
        let comp = new Compartment;
        wagon.addChild(comp);
    }
    root.addChild(wagon);
}