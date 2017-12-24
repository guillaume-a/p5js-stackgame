let a = 0;
let boxWidth = 200;
let boxHeight = 40;
let boxDepth = 200;

let side = "x";

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
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
        translate(cos(a)*boxWidth, 0, 0);
    } else {
        translate(0, 0, cos(a)*boxDepth);
    }

    box(boxWidth, boxHeight, boxDepth);

    a+=0.06;

}
