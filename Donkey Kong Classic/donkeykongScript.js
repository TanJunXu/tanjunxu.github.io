const { Engine, World, Bodies, Body, Events } = Matter;

let engine;
let world;
let person;
let bodyPart; 
let legsPart;
let walkingSpeed = 1.5; 
let jumpStrength = 0.09; 
let movingLeft = false;
let movingRight = false;
let barrels = []; 
let personImgRight, personImgLeft, barrelImg, lifeImg,titleImg;
let kongImgs = [];
let facingRight = true;
let kong;
let kongImgIndex = 0; 
let kongAnimationInterval = 600; 
let lastKongFrameTime = 0;
let barrelSpawned = false; 
let spawnPosition = { x: 200, y: 600 }; 
let lives = 3; 
let score = 0;
let peachImgs = []; 
let peachImgIndex = 0;
let peachAnimationInterval = 700;
let lastPeachFrameTime = 0; 
let width = 1280;
let height = 720;
let barrelStackImg;
let savedPrincess = false;
let menuState = true; 
let playAgainButton;
let startButton; 
let gameMusicLoaded = false;
let mainMusicLoaded = false;
let audioContextStarted = false;
let jumpSound;
let barrelDestroySound;
let deathsound; 
let gameMusic;
let mainMusic;

function preload() {
    personImgRight = loadImage('images/mario1.png');
    personImgLeft = loadImage('images/mario1left.png'); 
    barrelImg = loadImage('images/barrel.png');
    lifeImg = loadImage('images/life.png'); 
    barrelStackImg = loadImage('images/barrelstack.png');
    titleImg = loadImage('images/title.png');
    gameMusic = loadSound('sounds/gamemusic.mp3', () => { gameMusicLoaded = true; });
    mainMusic = loadSound('sounds/mainmusic.mp3', () => { mainMusicLoaded = true; });
    jumpSound = loadSound('sounds/jump.mp3');
    barrelDestroySound = loadSound('sounds/barrelsmash.mp3');
    deathsound = loadSound('sounds/death.mp3');

    for (let i = 1; i <= 5; i++) { 
        kongImgs.push(loadImage(`images/kong${i}.png`)); 
    }

    for (let i = 1; i <= 4; i++) {
        peachImgs.push(loadImage(`images/peach${i}.png`)); 
    }
}

function setup() { 
    createCanvas(width, height);

    if (mainMusicLoaded) {
        mainMusic.loop();
    }

    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 1.2; 

    playAgainButton = createButton('Play Again');
    playAgainButton.position(width / 2 - 100, height / 2 + 100);
    playAgainButton.size(200, 50);
    playAgainButton.mousePressed(resetGame);

    muteButton = createButton('Mute');
    muteButton.position(width - 100, height - 50);
    muteButton.size(80, 40);
    muteButton.mousePressed(toggleMusic);

    let ground = Bodies.rectangle(640, 680, 1000, 25, { isStatic: true, angle: -0.06, friction: 0.4 });
    World.add(world, ground);

    let platform1 = Bodies.rectangle(550, 540, 800, 25, { isStatic: true, angle: 0.03, friction: 0.4 });
    World.add(world, platform1);

    let platform2 = Bodies.rectangle(780, 380, 850, 25, { isStatic: true, angle: -0.06, friction: 0.4 });
    World.add(world, platform2);

    let platform3 = Bodies.rectangle(710, 220, 600, 25, { isStatic: true, angle: 0.08, friction: 0.4 });
    World.add(world, platform3);

    let platform4 = Bodies.rectangle(262, 196, 300, 25, { isStatic: true, angle: 0, friction: 0.4 });
    World.add(world, platform4);

    let platform5 = Bodies.rectangle(480, 100, 100, 25, { isStatic: true, angle: 0, friction: 0.4 });
    World.add(world, platform5);

    bodyPart = Bodies.rectangle(200, 600, 40, 30, { restitution: 0, friction: 1.0, render: { sprite: { texture: personImgRight } } });
    legsPart = Bodies.rectangle(200, 620, 40, 1, { isStatic: true, restitution: 0, friction: 1.5, render: { sprite: { texture: personImgRight } } });
    person = Body.create({
        parts: [bodyPart, legsPart],
        isStatic: false
    });
    World.add(world, person);

    kong = Bodies.rectangle(350, 190, 80, 80, { isStatic: true, render: { fillStyle: 'brown' } });
    World.add(world, kong);

    peach = Bodies.rectangle(480, 60, 40, 40, { isStatic: true, render: { fillStyle: 'pink' } });
    World.add(world, peach);

    setupCollisionEvents();
}

function startAudioContext() { //For the browser issue
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(() => {
            mainMusic.loop();
            canvas.mousePressed(null);
        });
    }
}

function setupCollisionEvents() {
    Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];

            if ((pair.bodyA === legsPart && pair.bodyB.label === 'barrel') ||
                (pair.bodyB === legsPart && pair.bodyA.label === 'barrel')) {
            if (pair.bodyA.label === 'barrel') {
                removeBarrel(pair.bodyA);
                } else {
                removeBarrel(pair.bodyB);
                }
            continue; 
            }
            if ((pair.bodyA === bodyPart && pair.bodyB.label === 'barrel') ||
                (pair.bodyB === bodyPart && pair.bodyA.label === 'barrel')) {
                resetPersonPosition();
                continue;
            }

            if ((pair.bodyA === bodyPart && pair.bodyB === peach) ||
                (pair.bodyB === bodyPart && pair.bodyA === peach)) {
                addPointsForPeach(); 
                savedPrincess = true;
            }
        }
    });
}

function draw() { 
    background('black');
    Engine.update(engine);

    if (menuState) {
        drawMainMenu();
        playAgainButton.hide();
        startButton.show();
        muteButton.hide();
    } else if (lives <= 0) {
        drawGameOverScreen();
        playAgainButton.show();
        startButton.hide(); 
        muteButton.show();
    } else if (savedPrincess) {
        drawSavePrincessScreen();
        playAgainButton.show();
        startButton.hide();
        muteButton.show();
    } else {
        playAgainButton.hide();
        startButton.hide(); 
        muteButton.show();  
        fill(139, 69, 19);
        rectMode(CENTER);
        let ground = world.bodies[0];
        drawBody(ground);

        let platform1 = world.bodies[1];
        drawBody(platform1);

        let platform2 = world.bodies[2];
        drawBody(platform2);

        let platform3 = world.bodies[3];
        drawBody(platform3);

        let platform4 = world.bodies[4];
        drawBody(platform4);

        let platform5 = world.bodies[5];
        drawBody(platform5);

        drawPerson(person.parts[0]);

        drawKong(kong);
        drawBarrelStack();
        drawPeach(peach);

        for (let i = 0; i < barrels.length; i++) {
            let barrel = barrels[i];
            drawBarrel(barrel);
        }

        drawLifeCounter();
        drawScore();

        if (person.position.y > height) {
            resetPersonPosition();
        }

        if (movingLeft) {
            Matter.Body.setVelocity(person, { x: -walkingSpeed, y: person.velocity.y });
            facingRight = false; 
        } else if (movingRight) {
            Matter.Body.setVelocity(person, { x: walkingSpeed, y: person.velocity.y });
            facingRight = true; 
        }

        updateKongAnimation();
        updatePeachAnimation();
    }
}
function startAudioContext() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(() => {
            mainMusic.loop();
            audioContextStarted = true;
        });
    } else {
        mainMusic.loop();
        audioContextStarted = true;
    }
} 
function drawBody(body) {
    let vertices = body.vertices;
    beginShape();
    noStroke();
    for (let vert of vertices) {
        vertex(vert.x, vert.y);
    }
    endShape(CLOSE);
}

function drawPerson(body) { 
    let pos = body.position;
    let angle = body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    let img = facingRight ? personImgRight : personImgLeft;
    image(img, 0, -7, 40, 40);
    pop();
}

function drawKong(body) {
    let pos = body.position; 
    let angle = body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(kongImgs[kongImgIndex], 0, -64, 140, 140);
    pop();
}

function updateKongAnimation() { 
    if (millis() - lastKongFrameTime > kongAnimationInterval) {
        kongImgIndex = (kongImgIndex + 1) % kongImgs.length; 
        lastKongFrameTime = millis();
        kongAnimationInterval = random(300, 800);
        if (kongImgIndex === kongImgs.length - 1 && !barrelSpawned) {
            createBarrel();
            barrelSpawned = true;
        } else if (kongImgIndex === 0) {
            barrelSpawned = false;
        }
    }
}

function keyPressed() { //Controls
    if (keyCode === 65) { // A key 
        movingLeft = true;
    } else if (keyCode === 68) { // D key 
        movingRight = true;
    } else if (keyCode === 87) { // W key
        Matter.Body.applyForce(person, person.position, { x: 0, y: -jumpStrength });
        jumpSound.play(); 
    }
}

function keyReleased() { //To make sure after releasing the key wont continue to walk
    if (keyCode === 65) { // A key
        movingLeft = false;
    } else if (keyCode === 68) { // D key
        movingRight = false;
    }
}

function createBarrel() { //let barrels roll
    let barrel = Bodies.circle(450, 170, 25, { density: 0.5, restitution: 0.5, label: 'barrel' });
    Matter.Body.setAngularVelocity(barrel, 0.1);
    World.add(world, barrel);
    barrels.push(barrel);
}

function drawBarrel(barrel) {
    let pos = barrel.position;
    let radius = barrel.circleRadius;
    
    push();
    translate(pos.x, pos.y);
    rotate(barrel.angle);

    let direction = barrel.velocity.x >= 0 ? 1 : -1;
    
    barrel.angle += direction * 0.001;

    imageMode(CENTER);
    image(barrelImg, 0, 0, radius * 2, radius * 2);
    pop();
}

function removeBarrel(barrel) { //for destroying barrel
    let index = barrels.indexOf(barrel);
    if (index !== -1) {
        barrels.splice(index, 1);
        World.remove(world, barrel);
        score += 10;
        barrelDestroySound.play();
    }
}

function resetPersonPosition() { //reset the person back to the initial location when dead
    Matter.Body.setPosition(person, spawnPosition); 
    Matter.Body.setVelocity(person, { x: 0, y: 0 });
    deathsound.play();
    lives--;
    if (lives <= 0) {
        if (lives <= 0) {
            push();
            fill(0, 0, 0, 150); 
            rect(0, 0, width, height);

            fill(255, 0, 0);
            textSize(64);
            textAlign(CENTER, CENTER);
            text("Game Over", width / 2, height / 2 - 50);
            textSize(32);
            fill(255);
            text(`Score: ${score}`, width / 2, height / 2 + 50);

            playAgainButton.show();

            pop();
        }
    }
}

function drawScore() { 
    push();
    fill(255);
    textSize(32);
    text(`Score: ${score}`, 100, 50); 
    pop();
}

function drawLifeCounter() {
    push();
    imageMode(CENTER);
    image(lifeImg, width - 80, 40, 40, 40);
    fill(255);
    textSize(32);
    text(`X${lives}`, width - 40, 50);
    pop();
}

function drawPeach(body) {
    let pos = body.position;
    let angle = body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(peachImgs[peachImgIndex], 0, -13, 75, 75); 
    pop();
}

function updatePeachAnimation() { 
    if (millis() - lastPeachFrameTime > peachAnimationInterval) {
        peachImgIndex = (peachImgIndex + 1) % peachImgs.length;
        lastPeachFrameTime = millis();
    }
}

function addPointsForPeach() { //add point when touches the princess
    score += 50;
}
function drawBarrelStack() {
    push();
    let stackX = kong.position.x - 105; 
    let stackY = kong.position.y - 68; 

    imageMode(CENTER);
    image(barrelStackImg, stackX, stackY, 120, 120); 
    pop();
}

function drawGameOverScreen() {
    push();
    fill(0, 0, 0, 150); 
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 50);
    textSize(32);
    fill(255);
    text(`Score: ${score}`, width / 2, height / 2 + 50);
    playAgainButton.show();

    pop();
}

function drawSavePrincessScreen() {
    push();
    fill(0, 0, 0, 150); 
    rect(0, 0, width, height);

    fill(255, 255, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("Congratulations!", width / 2, height / 2 - 50);
    textSize(32);
    fill(255);
    text(`Score: ${score}`, width / 2, height / 2 + 50);
    playAgainButton.show();
    pop();
}

function resetGame() { //reset to initialize
    lives = 3;
    score = 0;
    savedPrincess = false;

    Matter.Body.setPosition(person, spawnPosition);
    Matter.Body.setVelocity(person, { x: 0, y: 0 });

    for (let i = 0; i < barrels.length; i++) {
        World.remove(world, barrels[i]);
    }
    barrels = []; 
    kongImgIndex = 0;
    peachImgIndex = 0;
    mainMusic.stop();
    gameMusic.stop();
    gameMusic.loop();
    loop(); 
}

function drawMainMenu() {
    background(0);

    imageMode(CENTER);
    image(titleImg, width / 2, height / 2 - 200, 400, 200); 
    fill('lightblue');
    textSize(40);
    textStyle(BOLD)
    textAlign(CENTER, CENTER);
    text("How to Play This Game!", width / 2, height / 2 - 50);

    fill('white');
    textSize(25);
    textAlign(CENTER, CENTER);
    text("You only have 3 life, you can either try to dodge or destroy the barrels", width / 2, height / 2 + 20);
    fill('white');
    textSize(25);
    textAlign(CENTER, CENTER);
    text("that has been thrown down by Donkey Kong in order to save the Princess by reaching to her at the top.", width / 2, height / 2 + 70);
    fill('red');
    textSize(25);
    textAlign(CENTER, CENTER);
    text("Controls: W = Jump, A = Left, D = Right", width / 2, height / 2 + 110);

    if (!startButton) {
        startButton = createButton('Start Game');
        startButton.position(width / 2 - 100, height / 2 + 150); 
        startButton.size(200, 50); 
        startButton.style('font-size', '24px');
        startButton.mousePressed(startGame);
    }
}

function startGame() {
    menuState = false;
    resetGame(); 
}

function mousePressed() { 
    if (!audioContextStarted) {
        startAudioContext();
    }
}

function toggleMusic() { //mute button funciton
    if (gameMusic.isPlaying()) {
        gameMusic.pause();
        muteButton.html('Unmute');
    } else {
        gameMusic.loop();
        muteButton.html('Mute');
    }
}   