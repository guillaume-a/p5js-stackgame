let a = 0;
let height = 50;

function setup() {
    createCanvas(600, 600, WEBGL);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);

}

function draw() {

    rotateX(-QUARTER_PI);
    rotateY(atan(1));

    background(50);
    normalMaterial();

    translate(cos(a)*70, 0, 0);
    box(50);

    a+=0.1;

}
