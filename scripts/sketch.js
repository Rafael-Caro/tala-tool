var tal;
var talName;
var bolCircles = [];
var radiusBig; //radius of the big circle
var radius1 = 25; //radius of accented matra
var radius2 = 20;
var radius3 = 15;
var matra = 16; //number of beats
var cycle; //time in milliseconds of one cycle
var cursorX; //cursor line's x
var cursorY; //cursor line's y
var cursor;
var angle = -90; //angle of the cursor
var slider;
var tempo;
var alpha;
var backColor;
var mainColor;
var bolColor;
var position = 0;

function preload () {
  tal = loadTable("samples/tintal.csv");
}

function setup() {
  createCanvas(600, 600);
  ellipseMode(RADIUS);
  angleMode(DEGREES);
  talName = "तीन ताल\ntīntāl"
  radiusBig = width * (2 / 5);
  slider = createSlider(5, 300, 60)
    .position(10, height-30)
    .size(width-20, 20);
  cursorX = 0;
  cursorY = -radiusBig;
  backColor = color(185, 239, 162);
  mainColor = color(249, 134, 50);
  bolColor = color(249, 175, 120);
  for (var i = 0; i < tal.getRowCount(); i++) {
    var bolNum = tal.getNum(i, 0);
    var tali = tal.getNum(i, 1);
    var level = tal.getNum(i, 2);
    bolAngle = map(bolNum, 0, matra, -90, 270);
    var x = radiusBig * cos(bolAngle);
    var y = radiusBig * sin(bolAngle);
    var bol = tal.get(i, 3);
    var bolCircle = new BolCircle(x, y, tali, level, bol);
    bolCircles[i] = bolCircle;
  }
}

function draw() {
  background(backColor);
  tempo = slider.value(); //tempo
  fill(0);
  noStroke();
  textAlign(LEFT, BASELINE);
  textSize(12);
  text(str(tempo)+" bpm", 10, height-30); //tempo box

  push();
  translate(width/2, height/2);
  // rotate(-90);

  noStroke();
  alpha = map((angle+90)%360, 0, 360, 0, 255);
  mainColor.setAlpha(alpha);
  fill(mainColor);
  arc(0, 0, radiusBig, radiusBig, -90, angle%360);

  noFill();
  strokeWeight(2);
  mainColor.setAlpha(255);
  stroke(mainColor);
  ellipse(0, 0, radiusBig, radiusBig);
  //draw circle per bol
  for (var i = 0; i < bolCircles.length; i++) {
    bolCircles[i].display();
  }
  textAlign(CENTER, CENTER);
  textSize(30);
  strokeWeight(5);
  stroke(0);
  fill(mainColor);
  text(talName, 0, 0);

  position = updatePosition(position);

  //cursor
  // stroke(mainColor);
  // line(0, 0, cursorX, cursorY);
  fill("red");
  noStroke();
  ellipse(cursorX, cursorY, 5, 5);
}

function BolCircle (x, y, tali, level, bol) {
  this.x = x;
  this.y = y;
  this.display = function () {
    if (tali == 1) {
      fill(bolColor);
    } else {
      fill(backColor);
    }
    if (level == 1) {
      this.radius = radius1;
    } else if (level == 2) {
      this.radius = radius2;
    } else {
      this.radius = radius3;
    }
    stroke(mainColor);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius, this.radius);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    textSize(15);
    textStyle(BOLD);
    text(bol, this.x, this.y);
  }
}

function updatePosition (position) {
  var newPosition = millis();
  increase = newPosition - position;
  speed = matra * (60 / tempo) * 1000;
  angle += (360 * increase) / speed;
  angle = angle % 360;
  cursorX = radiusBig * cos(angle);
  cursorY = radiusBig * sin(angle);
  return newPosition;
}
