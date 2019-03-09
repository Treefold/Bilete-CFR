console.log("inceput");
class TreeNode{
    constructor(info){
        this.info = info;
        this.children = [];
    }
    get data(){
        return this.info;
    }

}

class Compartment {
    constructor(){
        this.freeSeats = 0;
    }
    get nrSeats(){
        return this.freeSeats;
    }
}

let root = new TreeNode();

for(let i = 0; i < 5; ++i)
{
    let wagon = new TreeNode;
    for(let j = 0; j < 10; ++j)
    {
        let comp = new Compartment;
        wagon.children.push(comp);
    }
    root.children.push(wagon);
}

root.children[0].children[0] = 71;
console.log(root.children[0].children[0]);