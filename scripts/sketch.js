//general variables
var talSet;
var talMenu = ["tīntāl", "ektāl"];
//tal features
var talName;
var avart;
var strokeCircles;
//style
var radiusBig; //radius of the big circle
var radius1 = 25; //radius of accented matra
var radius2 = 20; //radius of unaccented matra
var backColor;
var mainColor;
var matraColor;
//machanism
var speed;
var tempo;
var cursorX; //cursor line's x
var cursorY; //cursor line's y
var angle = -90; //angle of the cursor
var alpha;
var position = 0;
//html interaction
var slider;
var select;

function preload () {
  talSet = loadJSON("files/talSet.json");
}

function setup() {
  createCanvas(600, 600);
  ellipseMode(RADIUS);
  angleMode(DEGREES);
  //style
  radiusBig = width * (2 / 5);
  backColor = color(185, 239, 162);
  mainColor = color(249, 134, 50);
  matraColor = color(249, 175, 120);
  //html interaction
  slider = createSlider(5, 300)
    .position(10, height-30)
    .size(width-20, 20)
    .changed(updateTempo);
  select = createSelect()
    .position(10, 10)
    .changed(start);
  for (var i = 0; i < talMenu.length; i++) {
    select.option(talMenu[i]);
  }
  start();
  updateTempo();
}

function draw() {
  background(backColor);
  tempo = slider.value();
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
  for (var i = 0; i < strokeCircles.length; i++) {
    strokeCircles[i].display();
  }
  textAlign(CENTER, CENTER);
  textSize(30);
  strokeWeight(5);
  stroke(0);
  fill(mainColor);
  text(talName, 0, 0);

  position = updateCursor(position);

  //cursor
  // stroke(mainColor);
  // line(0, 0, cursorX, cursorY);
  fill("red");
  noStroke();
  ellipse(cursorX, cursorY, 5, 5);
}

function start() {
  //restart values
  strokeCircles = [];
  cursorX = 0;
  cursorY = -radiusBig;
  angle = -90;
  var talSortName = select.value();
  var tal = talSet[talSortName];
  talName = tal["name"];
  avart = tal["avart"];
  var tempoInit = tal["tempoInit"];
  var theka = tal["theka"];
  for (var i = 0; i < theka.length; i++) {
    var stroke = theka[i];
    var matra = stroke["matra"];
    var vibhag; //tali or khali
    if (int(stroke["vibhag"]) > 0) {
      vibhag = "tali";
    } else {
      vibhag = "khali";
    }
    var circleType;
    if (i == 0) {
      circleType = "sam";
    } else if ((stroke["vibhag"] % 1) < 0.101) {
      circleType = 1;
    } else if ((stroke["vibhag"] * 10 % 1) == 0) {
      circleType = 2;
    } else {
      circleType = 3;
    }
    var bol = stroke["bol"];
    var strokeCircle = new StrokeCircle(matra, vibhag, circleType, bol);
    strokeCircles[i] = strokeCircle;
  }
  slider.value(tempoInit);
}

function StrokeCircle (matra, vibhag, circleType, bol) {
  this.circleAngle = map(matra, 0, avart, -90, 270);
  this.x = radiusBig * cos(this.circleAngle);
  this.y = radiusBig * sin(this.circleAngle);
  this.bol = bol;

  this.strokeWeight = 2;

  if (circleType == "sam") {
    this.color = mainColor;
  } else if (vibhag == "tali") {
    this.color = matraColor;
  } else if (vibhag == "khali") {
    this.color = backColor;
  }

  if (circleType == "sam") {
    this.radius = radius1;
  } else if (circleType == 1) {
    this.radius = radius1;
  } else if (circleType == 2){
    this.radius = radius2;
  } else {
    this.radius = radius2;
    this.color = color(0, 0);
    this.strokeWeight = 0;
  }

  this.display = function () {
    stroke(mainColor);
    strokeWeight(this.strokeWeight);
    fill(this.color);
    ellipse(this.x, this.y, this.radius, this.radius);

    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    textSize(15);
    textStyle(BOLD);
    text(this.bol, this.x, this.y);
  }
}

function updateCursor (position) {
  var newPosition = millis();
  increase = newPosition - position;
  angle += (360 * increase) / speed;
  angle = angle % 360;
  cursorX = radiusBig * cos(angle);
  cursorY = radiusBig * sin(angle);
  return newPosition;
}

function updateTempo () {
  tempo = slider.value();
  speed = avart * (60 / tempo) * 1000;
}
