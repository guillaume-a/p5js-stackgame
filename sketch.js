let a = 0;
let side = "x";

let boxSize = {
    w: 200,
    h: 40,
    d: 200
}

let currentIndex = 0;
let stackSize = 32;
let stack = [];
let stackHeight = 0;

class Box {
    constructor(w, h, d) {
        this.ox = 0;
        this.oz = 0;
        this.width = w;
        this.height = h;
        this.depth = d;
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    draw() {
        translate(this.x + this.ox, this.y, this.z + this.oz);
        box(this.width, this.height, this.depth);
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);

    let currentBox;

    for (let i = stackSize-1; i >= 0; i--) {
        currentBox = new Box(boxSize.w, boxSize.h, boxSize.d);
        currentBox.y = -i * boxSize.h;
        stack[i] = currentBox;
    }
}

function mousePressed() {
    side = (side === "x") ? "z" : "x";

    let prevIndex = currentIndex;
    currentIndex--;

    if(currentIndex < 0) {
        currentIndex = stackSize-1;
    }

    stack[currentIndex].a = 0;
    stack[currentIndex].x = stack[prevIndex].x + stack[prevIndex].ox;
    stack[currentIndex].y = boxSize.h;
    stack[currentIndex].z = stack[prevIndex].z + stack[prevIndex].oz;

    for (let i = 0; i < stackSize; i++) {
        stack[i].y -= boxSize.h;
    }


}

function draw() {
    rotateX(-QUARTER_PI);
    rotateY(atan(1));

    background(50);
    normalMaterial();

    for (let i = 0; i < stackSize; i++) {
        push();
        if (i === currentIndex) {
            if (side === "x") {
                stack[i].ox = cos(stack[i].a) * stack[i].width;
            } else {
                stack[i].oz = cos(stack[i].a) * stack[i].depth;
            }
            stack[i].a += 0.06;
        }

        stack[i].draw();
        pop();
    }
}
