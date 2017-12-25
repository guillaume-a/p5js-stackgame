let wave = 0;
let waveSpeed = 0.05;
let side = "x";
let score = 0;

let boxSize = {
    w: 200,
    h: 40,
    d: 200
}

let currentIndex = 0;
let lastIndex = 1;
let stackSize = 16;
let stack = [];

let cameraHeight = 0;

class Box {
    constructor(w, h, d) {
        this.width = w;
        this.height = h;
        this.depth = d;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.ox = 0;
        this.oz = 0;
    }

    draw() {
        translate(this.x + this.ox, this.y, this.z + this.oz);
        box(this.width, this.height, this.depth);
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, (height-cameraHeight) / 2, (-height-cameraHeight) / 2, -500, 500);

    let currentBox;

    for (let i = stackSize-1; i >= 0; i--) {
        currentBox = new Box(boxSize.w, boxSize.h, boxSize.d);
        currentBox.y = -i * boxSize.h;
        stack[i] = currentBox;
    }
}

function mousePressed() {
    side = (side === "x") ? "z" : "x";

    prevIndex = currentIndex;
    currentIndex--;

    if(currentIndex < 0) {
        currentIndex = stackSize-1;
    }

    stack[currentIndex].x = stack[prevIndex].x + stack[prevIndex].ox;
    stack[currentIndex].y = stack[prevIndex].y + stack[prevIndex].height;
    stack[currentIndex].z = stack[prevIndex].z + stack[prevIndex].oz;
    stack[currentIndex].ox = 0;
    stack[currentIndex].oz = 0;

    wave=0;
    score++;

    cameraHeight+=boxSize.h;
    ortho(-width / 2, width / 2, (height-cameraHeight) / 2, (-height-cameraHeight) / 2, -500, 500);
}

function draw() {
    rotateX(-HALF_PI/3);
    rotateY(atan(1));

    background(50);
    normalMaterial();

    for (let i = 0; i < stackSize; i++) {
        push();

        if (i === currentIndex) {
            if (side === "x") {
                stack[i].ox = cos(wave) * stack[i].width;
            } else {
                stack[i].oz = cos(wave) * stack[i].depth;
            }
        }

        stack[i].draw();
        pop();
    }

    wave += waveSpeed;
}
