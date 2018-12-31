var tal;
var bolCircles = [];
var radiusBig; //radius of the big circle
var radius1 = 20; //radius of accented matra
var radius2 = 15;
var radius3 = 10;
var matra = 12; //number of beats
var cycle; //time in milliseconds of one cycle
var cursorX; //cursor line's x
var cursorY; //cursor line's y
var cursor;
var angle = 0; //angle of the cursor
var slider;
var tempo;
var alpha;
var backColor;
var mainColor;
var bolColor;
var position = 0;

function preload () {
  tal = loadTable("samples/ektal.csv");
}

function setup() {
  createCanvas(600, 600);
  ellipseMode(RADIUS);
  angleMode(DEGREES);
  radiusBig = width * (2 / 5);
  slider = createSlider(5, 300, 60)
    .position(10, height-30)
    .size(width-20, 20);
  cursorX = radiusBig;
  cursorY = 0;
  backColor = color(204);
  mainColor = color(249, 134, 50);
  bolColor = color(249, 175, 120);
  for (var i = 0; i < tal.getRowCount(); i++) {
    var bolNum = tal.getNum(i, 0);
    var tali = tal.getNum(i, 1);
    var level = tal.getNum(i, 2);
    bolAngle = map(bolNum, 0, matra, 0, 360);
    var x = radiusBig * cos(bolAngle);
    var y = radiusBig * sin(bolAngle);
    var bol = new BolCircle(x, y, tali, level);
    bolCircles[i] = bol;
  }
}

function draw() {
  background(backColor);
  tempo = slider.value(); //tempo
  fill(0);
  noStroke();
  text(str(tempo), 10, height-30); //tempo box

  push();
  translate(width/2, height/2);
  rotate(-90);

  noStroke();
  alpha = map(angle%360, 0, 360, 0, 255);
  mainColor.setAlpha(alpha);
  fill(mainColor);
  arc(0, 0, radiusBig, radiusBig, 0, angle%360);

  noFill();
  strokeWeight(2);
  mainColor.setAlpha(255);
  stroke(mainColor);
  ellipse(0, 0, radiusBig, radiusBig);
  //draw circle per bol
  for (var i = 0; i < bolCircles.length; i++) {
    bolCircles[i].display();
  }

  position = updatePosition(position);

  //cursor
  stroke(mainColor);
  line(0, 0, cursorX, cursorY);
  fill(mainColor);
  ellipse(cursorX, cursorY, 3, 3);
}

function BolCircle (x, y, tali, level) {
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
    ellipse(this.x, this.y, this.radius, this.radius);
  }
}

function updatePosition (position) {
  var newPosition = millis();
  increase = newPosition - position;
  speed = matra * (60 / tempo) * 1000;
  angle += (360 * increase) / speed;
  angle = angle%360;
  cursorX = radiusBig * cos(angle);
  cursorY = radiusBig * sin(angle);
  return newPosition;
}
