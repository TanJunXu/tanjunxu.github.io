let angle = 0;
let shrinkStart = 400; 
let shrinkRate = 0.995; 
let ballGroup1, ballGroup2, ballGroup3, ballGroup4, ballGroup5;
let flower;
let img;
let myImage;
let currentState = 'balls'; 
let stateStartTime; 

const ballsDuration = 4600; 
const ballDuration2 = 3000;
const flowerDuration = 4000; 
const flowerDuration2 = 3000; 
const ballDuration3 = 7500;
const ballDuration4 = 4000;
const duration = 100;

function preload() {
  img = loadImage('cic.png');
}

function setup() {
  createCanvas(1280, 720);
  frameRate(144);

  ballGroup1 = new BallGroup1(width / 2, height / 2, 4, 200, ['#FFD801', '#E75480', 'green', 'purple']);
  ballGroup2 = new BallGroup2(width / 2, height / 2, 1, 50, ['#00BFFF']);
  ballGroup3 = new BallGroup3(width / 2, height / 2, 1, 100, ['white']);
  ballGroup4 = new BallGroup4(width / 2, height / 2, 3, 200, ['#00BFFF', '#E41B17', '#00D600']);
  ballGroup5 = new BallGroup5(width / 2, height / 2, 4, 200, ['purple', '#FFD801', '#E75480', 'green']);
  ballGroup6 = new BallGroup6(width / 2, height / 2, 1, 100, ['#00BFFF']);
  flower = new Flower(width / 2, height / 2, 7, ['#FFD801', '#00BFFF', '#E75480', '#00D600', 'green', '#E41B17', 'purple'], 2, 3);
  myImage = new ImageClass(img, width / 2, height / 2, 0, 0);
  stateStartTime = millis(); 
}

function draw() {
  background('white');

  let elapsedTime = millis() - stateStartTime;

  switch (currentState) {
    case 'balls':
      if (elapsedTime > ballsDuration) {
        currentState = 'flower';
        stateStartTime = millis();
      } else {
        ballGroup1.update();
        ballGroup1.displaytrail();

        if (elapsedTime < ballDuration2) {
          ballGroup2.resize();
          ballGroup2.displayctr();
        } else {
          ballGroup4.resize2();
          ballGroup4.displaythree();
          ballGroup1.shrinksize();
        }
      }
      break;

    case 'flower':
      if (elapsedTime > flowerDuration) {
        currentState = 'ball2';
        stateStartTime = millis();
      } else {
        flower.spin();
        flower.enlarge();
        flower.display();
        
        if (elapsedTime > flowerDuration2) {
          flower.startShrinking();
          flower.shrinksize();
        }
      }
      break;

    case 'ball2':
      if (elapsedTime > ballDuration3) {
        currentState = 'initialize'; 
        stateStartTime = millis(); 
      } else {
        ballGroup5.display();
        ballGroup5.enlarge();
        ballGroup3.displaywhite();
        ballGroup6.displayctr();
        ballGroup6.enlarge2();
        ballGroup5.update1();
        ballGroup5.shrinkRadius();
      }
      if (elapsedTime < ballDuration4) {
        ballGroup5.shrinkRadius();
        ballGroup5.enlargeRadius();
      } else {
        ballGroup6.resizing();
        myImage.display();
        myImage.resize();
        myImage.resize2();
      }
      break;

    case 'initialize':
      if (elapsedTime > duration) {
        currentState = 'balls'; 
        stateStartTime = millis(); 
        ballGroup1 = new BallGroup1(width / 2, height / 2, 4, 200, ['#FFD801', '#E75480', 'green', 'purple']);
        ballGroup2 = new BallGroup2(width / 2, height / 2, 1, 50, ['#00BFFF']);
        ballGroup3 = new BallGroup3(width / 2, height / 2, 1, 100, ['white']);
        ballGroup4 = new BallGroup4(width / 2, height / 2, 3, 200, ['#00BFFF', '#E41B17', '#00D600']);
        ballGroup5 = new BallGroup5(width / 2, height / 2, 4, 200, ['purple', '#FFD801', '#E75480', 'green']);
        ballGroup6 = new BallGroup6(width / 2, height / 2, 1, 100, ['#00BFFF']);
        flower = new Flower(width / 2, height / 2, 7, ['#FFD801', '#1589FF', '#E75480', '#00D600', 'green', '#E41B17', 'purple'], 2, 3);
        myImage = new ImageClass(img, width / 2, height / 2, 0, 0);
        ballGroup1.shrinkMove = true;
        ballGroup2.shrinkMove = true;
        ballGroup3.shrinkMove = true;
        ballGroup4.shrinkMove = true;
        ballGroup5.shrinkMove = true;
        ballGroup6.shrinkMove = true;
        ballGroup1.shrinkingradius = true;
        ballGroup2.shrinkingradius = true;
        ballGroup3.shrinkingradius = true;
        ballGroup4.shrinkingradius = true;
        ballGroup5.shrinkingradius = true;
        ballGroup6.shrinkingradius = true;
        ballGroup1.larging = true;
        ballGroup2.larging = true;
        ballGroup3.larging = true;
        ballGroup4.larging = true;
        ballGroup5.larging = true;
        ballGroup6.larging = true;
        flower.isShrinking = true;
        myImage.shrinkMove = true;
        }
        break;
    }
}

class CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    this.x = x;
    this.y = y;
    this.numCircles = numCircles;
    this.initialRadius = initialRadius;
    this.colors = colors;
    this.circles = [];
    for (let i = 0; i < numCircles; i++) {
      this.circles.push(new Ball(x, y, angle + (i * TWO_PI / numCircles), initialRadius, colors[i]));
    }
  }

  update() {
    for (let circle of this.circles) {
      circle.updateRadius();
      circle.firstMove();
    }
  }

  update1() {
    for (let circle of this.circles) {
      circle.secondMove();
    }
  }

  display() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].display();
    }
  }

  displaytrail() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].displaytrail();
    }
  }

  displayctr() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].displayctr();
    }
  }

  displaythree() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].displaythree();
    }
  }
  displaywhite() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].displaywhite();
    }
  }

  resize() {
    for (let circle of this.circles) {
      circle.resize();
    }
  }

  resize2() {
    for (let circle of this.circles) {
      circle.resize2();
    }
  }

  enlarge() {
    for (let circle of this.circles) {
      circle.enlarge();
    }
  }

  resizing() {
    for (let circle of this.circles) {
      circle.resizing(); 
    }
  }
  resizing2() {
    for (let circle of this.circles) {
      circle.resizing2();
    }
  }

  enlarge2() {
    for (let circle of this.circles) {
      circle.enlarge2();
    }
  }


  shrinksize() {
    for (let circle of this.circles) {
      circle.shrinksize();
    }
  }
  shrinkRadius() {
    for (let circle of this.circles) {
      circle.shrinkRadius();
    }
  }
  enlargeRadius() {
    for (let circle of this.circles) {
      circle.enlargeRadius();
    }
  }
}


class Ball {
  constructor(x, y, initialAngle, initialRadius, color) {
    this.pos = createVector(x, y);
    this.small = createVector(0, 0);
    this.angle = initialAngle;
    this.spinSpeed = 0.01;
    this.firstRun = true;
    this.currentFrame = 0;
    this.size = 0;
    this.size2 = 140;
    this.targetSize = 100;
    this.radius = initialRadius;
    this.shrinkMove = true;
    this.bigger = true;
    this.trail = [];
    this.maxTrailLength = 7;
    this.color = color;
    this.movementProgress = 0;
    this.rotationProgress = 0;
    this.rotationSpeed = PI / 45;
    this.shrinkingradius = true;
    this.enlarging = true;
    this.larging = true;
  }

  updateRadius() {
    if (this.currentFrame > shrinkStart) {
      this.radius *= shrinkRate;
    }
  }

  updateTrail() {
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  display() {
    push();
    translate(width / 2, height / 2);
    noStroke();

    this.pos.x = this.radius * cos(this.angle);
    this.pos.y = this.radius * sin(this.angle);

    translate(this.pos.x, this.pos.y);

    fill(this.color);
    ellipse(this.small.x, this.small.y, this.size, this.size);

    rotate(this.angle);

    pop();

    this.currentFrame++;
  }
  displaytrail() {
    push();
    translate(width / 2, height / 2);
    noStroke();

    this.pos.x = this.radius * cos(this.angle);
    this.pos.y = this.radius * sin(this.angle);

    this.updateTrail();

    for (let i = 0; i < this.trail.length; i++) {
      let trailPos = this.trail[i];
      let alpha = map(i, 0, this.trail.length, 0, 255);
      fill(0, 0, 0, alpha / 2);
      ellipse(trailPos.x, trailPos.y, this.size2, this.size2);
    }

    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    fill(this.color);
    ellipse(this.small.x, this.small.y, this.size2, this.size2);

    pop();

    this.currentFrame++;
  }

  displayctr() {
    push();
    noStroke();
    translate(width / 2, height / 2);
    fill(this.color);
    ellipse(0, 0, this.size, this.size);
    pop();
  }

  displaythree() {
    push();
    noStroke();
    this.angle -= this.spinSpeed;
    this.spinSpeed += 0.0001;
    translate(width / 2, height / 2);
    rotate(this.angle);
    let adjustedRadius = this.radius * 0.1;
    this.pos.x = adjustedRadius * cos(this.angle);
    this.pos.y = adjustedRadius * sin(this.angle);
    translate(this.pos.x,this.pos.y);
    fill(this.color);
    ellipse(0, 0, this.size, this.size);
    pop();
  }

  displaywhite() {
    push();
    noStroke();
    translate(width / 2, height / 2);
    fill(this.color);
    ellipse(0, 0, this.size2, this.size2);
    pop();
  }

  resize() {
    if (this.shrinkMove && this.size < 150) {
      this.size += 0.5;
    } else {
      if (this.size > 0) {
        this.size -= 1;
        this.shrinkMove = false;
      }
    }
  }

  resize2() {
    if (this.shrinkMove && this.size < 40) {
      this.size += 0.3;
    } else {
      if (this.size > 0) {
        this.size -= 0.3;
        this.shrinkMove = false;
      }
    }
  }

  enlarge() {
    if (this.size < this.size2) {
      this.size += 1;
    }
  }

  enlarge2() {
    if (this.larging && this.size < this.targetSize) {
      this.size += 1;
    }
    else{
      this.larging = false;
    }
  }

  resizing() {
    if(!this.larging && this.size > 0 ) {
      this.size -= 1;
    }
  }

  shrinksize() {
    if (this.size2 >= 60) {
      this.size2 -= 0.5;
    }
  }

  firstMove() {
    this.angle -= this.spinSpeed;
    this.spinSpeed += 0.0001;
    if (this.firstRun && this.spinSpeed < 0.0001 && this.small.x > 0) {
      this.small.x -= 100;
      this.small.y -= 100;
    } else {
      this.firstRun = false;
    }
  }
  shrinkRadius() {
    if (this.shrinkingradius && this.radius > 100) {
      this.radius -= 0.3;
    }
      else{
      this.shrinkingradius = false;
      }
  }
  enlargeRadius() {
    if (!this.shrinkingradius && this.radius < 200) {
      this.radius += 0.4;
    }
    else{
      this.larging = false;
    }
  }

  secondMove() {
  let rotationStep = PI / 180;

  if (this.rotationProgress < HALF_PI) {
    this.angle -= rotationStep;
    this.rotationProgress += rotationStep; 
  }
  }
}

class BallGroup1 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}

class BallGroup2 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}

class BallGroup3 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}

class BallGroup4 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}
class BallGroup5 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}
class BallGroup6 extends CircleGroup {
  constructor(x, y, numCircles, initialRadius, colors) {
    super(x, y, numCircles, initialRadius, colors);
  }
}

class Flower {
  constructor(x, y, numPetals, colors, initialScale, targetScale) {
    this.x = x;
    this.y = y;
    this.numPetals = numPetals;
    this.colors = colors;
    this.scale = initialScale;
    this.targetScale = targetScale;
    this.angleStep = 7;
    this.angle = 0;
    this.spinSpeed = 0.001;
    this.maxSpinSpeed = 0.1;
    this.minSpinSpeed = 0.05;
    this.isShrinking = true;
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.scale);
    rotate(this.angle);

    for (let i = 0; i < this.numPetals; i++) {
      push();
      rotate(i * this.angleStep);
      translate(5, -18);
      this.drawPetal(this.colors[i]);
      pop();
    }

    pop();
  }

  drawPetal(petalColor) {
    fill(petalColor);
    noStroke();

    beginShape();
    vertex(0, 0);
    bezierVertex(20, -1, 80, 60, -1, 75);
    bezierVertex(40, 40, 6, 2, 4, 3);
    endShape(CLOSE);
  }

  spin() {
    if (this.scale < this.targetScale) {
      this.spinSpeed = this.maxSpinSpeed;
    } else {
      this.spinSpeed = this.minSpinSpeed;
    }

    this.angle -= this.spinSpeed;
    if (this.angle > TWO_PI) {
      this.angle -= TWO_PI;
    }
  }

  enlarge() {
    if (this.isShrinking && this.scale < this.targetScale) {
      this.scale += 0.02;
    }
  }

  shrinksize() {
    if (!this.isShrinking && this.scale > 0) {
      this.scale -= 0.02;
    }
  }

  startShrinking() {
    this.isShrinking = false;
  }
}

class ImageClass {
  constructor(img, x, y, initialWidth, initialHeight) {
    this.img = img;
    this.pos = createVector(x, y);
    this.width = initialWidth;
    this.height = initialHeight;
    this.shrinkMove = true;
    this.targetSize2 = 120;
  }

  display() {
    if (this.width > 0 && this.height > 0) {
      image(this.img, this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
    }
  }

  resize() {
    if (this.shrinkMove && this.width < this.targetSize2) {
      this.width += 0.5;
      this.height += 0.5;
    } else {
      this.shrinkMove = false;
    }
  }
  resize2(){
    if (!this.shrinkMove && this.width > 0) {
      this.width -= 0.5;
      this.height -= 0.5;
    }
  }
}
