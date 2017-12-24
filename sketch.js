let a = 0;
let side = "x";

let boxSize = {
    w: 200,
    h: 40,
    d: 200
}

let currentBox = 0;
let stackSize = 10;
let stack = [];

class Box {
    constructor(w, h, d) {
        this.width = w;
        this.height = h;
        this.depth = d;
        this.x = 0;
        this.z = 0;
    }

    draw() {
        box(this.width, this.height, this.depth);
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);

    for (let i = 0; i < stackSize; i++) {
        stack[i] = new Box(boxSize.w, boxSize.h, boxSize.d);
    }
}

function mousePressed() {
    side = (side === "x") ? "z" : "x";
    currentBox--;
    if(currentBox < 0) {
        currentBox = stackSize-1;
    }
}

function draw() {
    rotateX(-QUARTER_PI);
    rotateY(atan(1));

    background(50);
    normalMaterial();

    for (let i = 0; i < stackSize; i++) {
        translate(0, -boxSize.h, 0);

        push();
        if (i === currentBox) {
            if (side === "x") {
                translate(cos(a) * boxSize.w, 0, 0);
            } else {
                translate(0, 0, cos(a) * boxSize.d);
            }
        }
        stack[i].draw();

        pop();
    }

    a += 0.06;

}
