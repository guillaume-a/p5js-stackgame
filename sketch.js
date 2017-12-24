let a = 0;
let side = "x";
let currentBox;

let boxSize = {
    w: 200,
    h: 40,
    d: 200
}

class Box {
    constructor(w, h, d) {
        this.width = w;
        this.height = h;
        this.depth = d;
    }

    draw() {
        box(this.width, this.height, this.depth);
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);

    currentBox = new Box(boxSize.w, boxSize.h, boxSize.d);
}

function mousePressed() {
    side = (side === "x") ? "z" : "x";
}

function draw() {
    rotateX(-QUARTER_PI);
    rotateY(atan(1));

    background(50);
    normalMaterial();

    if(side === "x") {
        translate(cos(a)*boxSize.w, 0, 0);
    } else {
        translate(0, 0, cos(a)*boxSize.d);
    }

    currentBox.draw();

    a+=0.06;

}
