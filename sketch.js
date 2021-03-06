class Tween {

    constructor(start, end, ease, threshold, callback) {
        this.start = start;
        this.end = end;
        this.ease = ease;
        this.threshold = threshold;
        this.callback = callback;

        this.reset();
    }

    reset() {
        this.delta = 0;
        this.current = this.start;
    }

    step() {
        let diff = this.end - this.current;
        this.delta = Math.floor(diff * this.ease);

        if(this.delta == 0) {
            this.callback();
        } else if(this.delta <= this.threshold) {
            this.current = this.end;
            this.delta = diff;
        } else {
            this.current += this.delta;
        }
    }
}

class Box {
    constructor(w, h, d) {
        this.width = w;
        this.height = h;
        this.depth = d;
        this.reset();
    }

    reset() {
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

const IN_GAME = 1;
const GAME_OVER = 2;
const MOVE_BOXES = 3;

const SIDE_X = "x";
const SIDE_Z = "z";

let state = IN_GAME;
let wave = 0;
let waveSpeed = 0.05;
let side = SIDE_X;
let score = 0;
let threshold = 5;

let boxSize = {
    w: 200,
    h: 40,
    d: 200
}

let currentIndex = 0;
let prevIndex = 1;
let stackSize = 16;
let stack = [];

let tween;

let bgColors = [];

function setBackgroundColor() {
    let pointsPerRange = 20;
    let pointsFullRange = (bgColors.length-1) * pointsPerRange;

    let colorIndex = Math.floor((score / pointsPerRange) % bgColors.length);

    let moduloScore = score % pointsPerRange;

    colorNextIndex = colorIndex + 1;
    if(colorNextIndex === bgColors.length) {
        colorNextIndex = 0;
    }

    background(lerpColor(bgColors[colorIndex], bgColors[colorNextIndex], moduloScore/pointsPerRange));
}

function setup() {
    bgColors = [
       color('#E4E8C5'),
       color('#D7E8A0'),
       color('#C7CFC7'),
       color('#A1A3B7'),
       color('#7B9FB7'),
   ];

    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, -500, 500);

    tween = new Tween(0, boxSize.h, 0.3, 1, () => {
        cloneBox();
        wave = 0;
        state = IN_GAME;
    });

    for (let i = stackSize-1; i >= 0; i--) {
        stack[i] = new Box(boxSize.w, boxSize.h, boxSize.d);
        stack[i].y = -i * boxSize.h;
    }

    newGame();
}

function mousePressed() {
    if(state !== IN_GAME) {
        return;
    }

    //merge position with offset
    stack[currentIndex].x = stack[currentIndex].x + stack[currentIndex].ox;
    stack[currentIndex].z = stack[currentIndex].z + stack[currentIndex].oz;
    stack[currentIndex].ox = 0;
    stack[currentIndex].oz = 0;

    //calculate cutsize
    cutSize = stack[currentIndex][side] - stack[prevIndex][side];

    //check if current shot if a perfect one
    let perfect = abs(cutSize) < threshold;

    if(perfect) {
        console.log("PERFECT !!");
        score++;
        cutSize = 0;
        stack[currentIndex][side] = stack[prevIndex][side];
    }

    if(
        side === SIDE_X && stack[currentIndex].width - abs(cutSize) < 0 ||
        side === SIDE_Z && stack[currentIndex].depth - abs(cutSize) < 0
    ) {
        state = GAME_OVER;
        gameOver();
        return;
    }

    if(side === SIDE_X) {
        stack[currentIndex].width -= abs(cutSize);
        stack[currentIndex].x -= cutSize / 2;
    }
    else {
        stack[currentIndex].depth -= abs(cutSize);
        stack[currentIndex].z -= cutSize / 2;
    }

    score++;
    side = (side === SIDE_X) ? SIDE_Z : SIDE_X;

    tween.reset();
    state = MOVE_BOXES;
}

function cloneBox() {
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
    stack[currentIndex].width = stack[prevIndex].width;
    stack[currentIndex].depth = stack[prevIndex].depth;
}

function draw() {
    if(state === GAME_OVER) {
        return;
    }

    updateGUI();

    rotateX(-HALF_PI/3);
    rotateY(atan(1));

    setBackgroundColor();

    normalMaterial();

    for (let i = 0; i < stackSize; i++) {
        push();
        if(state === IN_GAME) {
            if (i === currentIndex) {
                if (side === SIDE_X) {
                    stack[i].ox = cos(wave) * (stack[i].width + 15);
                } else {
                    stack[i].oz = cos(wave) * (stack[i].depth + 15);
                }
            }
        }
        else if(state === MOVE_BOXES) {
            stack[i].y -= tween.delta;
        }

        stack[i].draw();
        pop();
    }

    if(state === IN_GAME) {
        wave += waveSpeed;
    }
    else if(state === MOVE_BOXES) {
        tween.step();
    }
}

function newGame() {
    for (let i = stackSize-1; i >= 0; i--) {
        stack[i].width = boxSize.w;
        stack[i].height = boxSize.h;
        stack[i].depth = boxSize.d;
        stack[i].reset();
        stack[i].y = -i * boxSize.h;
    }

    document.getElementById("gameover").style.display = "none";

    side = SIDE_X;
    score = 0;
    currentIndex = 0;
    prevIndex = 1;

    state = IN_GAME;
}

function gameOver() {
    document.getElementById("score").innerText = "Final Score : " + score.toString();
    document.getElementById("gameover").style.display = "block";
}

function updateGUI() {
    document.getElementById("score").innerText = "Score : " + score.toString();
}
