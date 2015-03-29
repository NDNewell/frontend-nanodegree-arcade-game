// create superclass Enemy

function Enemy() {

    // set random horizontal position

    this.x = randomRange(505, 1);

    // set random enemy speed

    this.speed = randomRange(115, 50);

}


// update Enemy objects

Enemy.prototype.update = function(dt) {

    // update the enemy's position using time delta between ticks

    this.x += this.speed * dt;

    // check if speed needs to be adjusted for the specific level

    speedAdjust();

    // reset enemy's position after moving off screen

    if(this.x > 505) {

        this.x = -100;

    }

}


// collision detection method using box collision for enemies

Enemy.prototype.collisions = function () {

    // check if collisions are activated (eg. that star power isn't activated)

        if(!starPower) {

            allEnemies.forEach(function(enemy) {

                if(enemy.x + enemy.left < player.x + player.right &&
                   enemy.x + enemy.right > player.x + player.left &&
                   enemy.y + enemy.top < player.y + player.bottom &&
                   enemy.y + enemy.bottom > player.y + player.top) {

                    // reset player

                    die();

                }

            });

        }

}


// create subclass evilEnemy from Enemy

function evilEnemy() {

    // call prototype properties from Enemy

    Enemy.call(this);

    // set vertical position

    this.y = 300;

    // set variables for evilEnemy dimensions

    this.right = 70;
    this.left = 0;
    this.bottom = 75;
    this.top = 0;
    this.sprite = 'images/enemy-bug.png';

}


// set evilEnemy prototype as a subclass of Enemy

evilEnemy.prototype = Object.create(Enemy.prototype);


// set evilEnemy constructor

evilEnemy.prototype.constructor = evilEnemy;


// create subclass evilerEnemy from Enemy

function evilerEnemy() {

    // call prototype properties from Enemy

    Enemy.call(this);

    // set vertical position

    this.y = 30;

    // set variables for evilerEnemy dimensions

    this.right = 100;
    this.left = 0;
    this.bottom = 100;
    this.top = 0;
    this.sprite = 'images/enemy-bug3.png';

}


// set evilerEnemy prototype as a subclass of Enemy

evilerEnemy.prototype = Object.create(Enemy.prototype);


// set evilerEnemy constructor

evilerEnemy.prototype.constructor = evilerEnemy;


// create subclass evilestEnemy from Enemy

function evilestEnemy() {

    // call prototype properties from Enemy

    Enemy.call(this);

    // set vertical position

    this.y = 125;

    // set variables for evilestEnemy dimensions

    this.right = 130;
    this.left = 0;
    this.bottom = 140;
    this.top = 50;
    this.sprite = 'images/enemy-bug2.png';

}


// Set evilestEnemy prototype as a subclass of Enemy

evilestEnemy.prototype = Object.create(Enemy.prototype);


// set evilestEnemy constructor

evilestEnemy.prototype.constructor = evilestEnemy;


// Draw the enemies on the screen

Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}


// Create player class

function Player() {

    // set intitial player position

    this.x = 200;
    this.y = 475;

    // set variables for player dimensions

    this.right = 77;
    this.left = -15;
    this.bottom = 55;
    this.top = -25;

    // set player image

    this.sprite = 'images/char-cartman.png';

    // set player game conditions

    this.lives = 3;
    this.points = 0;
    this.level = 1;
    this.touchWater = 0;

}


// set conditions for game loop continuance and update player/game properties

Player.prototype.update = function(dt) {

    // check Player's lives

    checkLives();

    // check level advancement

    checkLevel();

    // give the player an extra life for every 1000 points

    if (this.points >= bonus*1000) {

        bonus ++;
        this.lives ++;

        // play appropriate sound

        extraLifeSound.play();

    }

}


// draw the player on the screen

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}


// key instructions for player movements

Player.prototype.handleInput = function(key) {

    var stepSize = 35;

    switch(key) {

        case 'left':

            if(this.x > 0) {

                this.x -= stepSize;

            }

            break;

        case 'right':

            // adjust allowable range of movement when Player has star power because of differing img sizes for Player sprite

            if(this.sprite === 'images/char-cartman-wizard.png') {

                if (this.x < 340) {

                this.x += stepSize;

                }

            } else {

                if (this.x < 400) {

                this.x += stepSize;

                }

            }

            break;

        case 'up':

            // player is reset to default position when reaching the water

            if(this.y > 25) {

                this.y -= stepSize;

            } else {

                this.touchWater++;
                reachTopSound.play();

                // check level progression and increase level accordingly

                if (this.touchWater >= this.level*3) {

                    this.level++;
                    goUplevel = true;

                }

                restartPlayer();

            }

            break;

        case 'down':

            if(this.y < 475) {

                this.y += stepSize;

            }

            break;

          case 'p':

            // pause the game only during game play

            if(!paused && !beginGame && !goUplevel && player.lives > 0) {

                pauseSound.play();
                stopGame = true;
                paused = true;

                // save time left in star power countdown in order to being where leaving off after unpausing the game

                if(starPower) {

                    savedStarTime = starTime;

                }

            } else if(paused) {

                unPauseSound.play();
                reset();

            }

            break;

            // continue from prompts: win game, game over, pass level, being game

        case 'space':

            if(player.lives === 0 || winGame || goUplevel || beginGame) {

                spacebarClickSound.play();
                reset();

            }

            break;

    }

}


// listen for key presses and send the keys to Player.handleInput() method.

document.addEventListener('keyup', function(e) {

    var allowedKeys = {

        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'p'

    };

    player.handleInput(allowedKeys[e.keyCode]);

});


// create Relic superclass

function Relic() {

    // set random horizontal position

    this.x = randomRange(-1500, -500);

    // set random row

    var randomRow = randomRange(5, 1);

    // assign a specific row depending on the number generated from randomRow

    if(randomRow === 1) {

        this.y = 115;

    } else if (randomRow === 2) {

        this.y = 195;

    } else if (randomRow === 3) {

        this.y = 280;

    } else if (randomRow === 4) {

        this.y = 360;

    }

    // set random relic speed

    this.speed = randomRange(100, 50);

}


Relic.prototype.update = function(dt) {

    // update the Relic's position using time delta between ticks

    this.x += this.speed * dt;

    // reset Relic if it moves off the screen
    // set random starting point for x
    // key, Star, and Heart are reset to further points away in order to make them less common

    if(this.x > 505) {

        this.reset();

    }

}


// Reset random starting point for x and y
// Key, Star, and Heart are reset to further points away in order to make them less common.

Relic.prototype.reset = function() {

    if(this.sprite === 'images/Key.png' || this.sprite === 'images/Heart.png' || this.sprite === 'images/Star.png') {

        this.x = randomRange(-5000, -3000);

    } else {

        // Gems get set to the default starting point

        this.x = randomRange(-500, -1500);

    }

    // set a random row for this.y for all relics

    var randomRow = randomRange(5, 1);

    if(randomRow === 1) {

        this.y = 115;

    } else if (randomRow === 2) {

        this.y = 195;

    } else if (randomRow === 3) {

        this.y = 280;

    } else if (randomRow === 4) {

        this.y = 360;

    }
}


// collision detection method for Relics using box collision

Relic.prototype.collisions = function () {

    allRelics.forEach(function(relic) {

        if(relic.x + relic.left < player.x + player.right &&
          relic.x + relic.right > player.x + player.left &&
          relic.y + relic.top < player.y + player.bottom &&
          relic.y + relic.bottom > player.y + player.top) {

            // set conditions for Relic collisions

            relic.collisionConditions();

            // reset Relic position

            relic.reset();

        }

    });

}


// set conditions for what happens after the player Collides with a Relic

Relic.prototype.collisionConditions = function () {

    // check type of Relic, play appropriate sound, update player conditions and properties

    // check for Gems

    if(this.sprite === 'images/Gem-Blue-sm.png' || this.sprite === 'images/Gem-Orange-sm.png' || this.sprite === 'images/Gem-Green-sm.png') {

        // play appropriate Gem sounds

        if(this.sprite === 'images/Gem-Blue-sm.png') {

            blueGemSound.play();

        } else if (this.sprite === 'images/Gem-Orange-sm.png') {

            orangeGemSound.play();

        } else if (this.sprite === 'images/Gem-Green-sm.png') {

            greenGemSound.play();
        }

        // initiate canvas rendering of points above player

        getGem = true;

        // set Gem value and add to points total

        gemValue = this.value;
        player.points += gemValue;

        // set points display timer

        pointsDisplay ();

    // check for Heart sprite

    } else if (this.sprite === 'images/Heart.png') {

        // increase player lives by 1 and play appropriate sound

        player.lives++;
        heartSound.play();

    // check for Star

    } else if (this.sprite === 'images/Star.png') {

        // play appropriate sounds

        transformSound.play();
        starBackgroundSound.play();

        // initiate canvas rendering of countdown and disable Enemy collisions

        starPower = true;

        // display time remaining for star power and reset player conditions/properties after time runs out

        starTimerDisplay(10);

        // change Player sprite image

        player.sprite = 'images/char-cartman-wizard.png';

        // change player dimensions to make up for img size differences that affect collisions

        player.right = 100;
        player.left = -15;
        player.bottom = 70;
        player.top = -25;

    // check for Key

    } else if (this.sprite === 'images/Key.png') {

        // play appropriate sound

        keySound.play();

        // Player automatically goes up one level

        player.level++;

        // stop the game loop and render 'pass level' prompt to canvas

        goUplevel = true;

        // align the number of times the Player has touched the water with new level

        if(player.level === 2) {

            player.touchWater = 3;

        } else if (player.level === 3) {

            player.touchWater = 6;

        } else if (player.level === 4) {

            player.touchWater = 9;

        } else if (player.level === 5) {

            player.touchWater = 12;

        }

        // reset Player starting position

        restartPlayer();

    }

}


// draw the Relic on the screen

Relic.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}


// create Gem subclass of Relic

function Gem(spriteImg, value) {

    // call prototype properties from Relic

    Relic.call(this);

    // set variable dimensions for Gem

    this.right = 20;
    this.left = -10;
    this.bottom = 20;
    this.top = -40;

    // set Gem image

    this.sprite = spriteImg;

    // set Gem value

    this.value = value;

}


// set Gem prototype as a subclass of Relic

Gem.prototype = Object.create(Relic.prototype);


// set Gem constructor

Gem.prototype.constructor = Gem;


// create Key subclass of Relic

function Key() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position

    this.x = randomRange(-5000, -3000);

    // set variable dimensions for Key

    this.right = 10;
    this.left = -5;
    this.bottom = 0;
    this.top = -40;

    // set Key image

    this.sprite = 'images/Key.png';

}


// set Key prototype as a subclass of Relic

Key.prototype = Object.create(Relic.prototype);


// set Key constructor

Key.prototype.constructor = Key;


// create Heart subclass of Relic

function Heart() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position

    this.x = randomRange(-5000, -3000);

    // set variable dimensions for Heart

    this.right = 30;
    this.left = -5;
    this.bottom = 10;
    this.top = -65;

    // set Heart image

    this.sprite = 'images/Heart.png';

}


// set Heart prototype as a subclass of Relic

Heart.prototype = Object.create(Relic.prototype);


// set Heart constructor

Heart.prototype.constructor = Heart;


// create Star subclass of Relic

function Star() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position

    this.x = randomRange(-5000, -3000);

    // set variable dimensions for Star

    this.right = 15;
    this.left = 0;
    this.bottom = 5;
    this.top = -25;

    // set Star image

    this.sprite = 'images/Star.png';

}


// set Star prototype as a subclass of Relic

Star.prototype = Object.create(Relic.prototype);


// set Star constructor

Star.prototype.constructor = Star;


// set a random number within a given range

function randomRange (max, min) {

    // generate a number between min and max for objects' x and y positions, and speeds

    return Math.floor((Math.random() * (max - min)) + min);

}


// check conditions for Enemy speed adjustment according to level

function speedAdjust () {

    if(adjustSpeed) {

        if(player.level === 1) {

            allEnemies.forEach(function(enemy) {

                enemy.speed = randomRange(115, 50);

            });

        } else if (player.level ===2) {

            allEnemies.forEach(function(enemy) {

                enemy.speed = randomRange(180, 115);

            });

        } else if (player.level ===3) {

            allEnemies.forEach(function(enemy) {

                enemy.speed = randomRange(245, 180);

            });

        } else if (player.level ===4) {

            allEnemies.forEach(function(enemy) {

                enemy.speed = randomRange(310, 245);

            });

        }

    adjustSpeed = false;

    }

}


// reset Player position, play appropriate sound , subtract 1 life

function die () {

    heySound.play();
    player.lives--;
    restartPlayer();

}


// reset player to starting position

function restartPlayer () {

    player.x = 200;
    player.y = 475;

}


// check Player's lives and stops game if zero

function checkLives () {

    if(player.lives === 0) {

        // stop game loop and play appropriate sounds

        stopGame = true;
        gameOverSound.play();
        sonBitchSound.play();

    }

}


// check level and enable various sounds and game status depending on the level

function checkLevel () {

    // check level

    if(goUplevel) {

        // turn off star power

        disableStarPower();

        // stop the game loop

        stopGame = true;

        // play the following sounds only if below level 5

        if(player.level < 5) {

            completeLevelSound.play();
            respectSound.play();

        // when Player wins, play different sounds and set win game variable

        } else {

            winGame = true;
            winGameSound.play();
            screwYouSound.play();

        }

    }

}


// set timer for how long points appear on screen after obtaining a Gem

function pointsDisplay () {

    // if a Gem has been collected, getGem will be true, intiating the timer
    // the points will be shown on the canvas for as long as the timer is activated

    if (getGem) {

        gemTime = 1;

        var gemTimer = setInterval(function() { 

            gemTime--;

            if(gemTime <= 0) {

                clearInterval(gemTimer);

                getGem = false;

                }

        }, 1000);

    }
}


// set timer for star power timer and reset player properties/conditions when the timer is finished

function starTimerDisplay (time) {

    // set countdown time

    starTime = time;

    // create timer

    var starTimer = setInterval(function() { 

        starTime--;

        // if the game is paused, reset starTime with time that was saved when pausing the game in order to resume countdown where leaving off

        if(paused) {

            starTime = savedStarTime;

        }

        // if timer gets to zero or the player wins the game, the timer resets the original player properties/conditions

        if(starTime <= 0 || player.level === 5) {

            // the untransform sound is only played if the player hasn't completed a level or won the game so as not to interfere with game sounds (eg. passing a level, game over, or winning the game)

            if(!winGame && !goUplevel && !paused) {

                untransformSound.play();

            }

            clearInterval(starTimer);

            // remove star power

            disableStarPower();

        }

    }, 1000);

}


// removes star power properties and conditions, resets player img and dimensions

function disableStarPower () {

    starPower = false;
    player.sprite = 'images/char-cartman.png';
    player.right = 77;
    player.left = -15;
    player.bottom = 55;
    player.top = -25;

    // star power and associated sounds are immediately turned off in order not to interfere with level up or game win sounds

    if(goUplevel) {

        starTime = 0;
        starBackgroundSound.pause();

    }

}


// instantiate objects

var allEnemies = [

    new evilerEnemy(),
    new evilestEnemy(),
    new evilEnemy()

    ];


var player = new Player();


var allRelics = [

    new Gem('images/Gem-Blue-sm.png', 100),
    new Gem('images/Gem-Orange-sm.png', 300),
    new Gem('images/Gem-Green-sm.png', 500),
    new Key(),
    new Heart(),
    new Star()

    ];


// Player sound instances

var heySound = new Audio('sounds/hey.wav');
var respectSound = new Audio('sounds/respect.wav');
var screwYouSound = new Audio('sounds/screwYou.wav');
var sonBitchSound = new Audio('sounds/son_of_a.wav');


// Relic sound instances

var blueGemSound = new Audio('sounds/blueGem.wav');
var greenGemSound = new Audio('sounds/greenGem.wav');
var orangeGemSound = new Audio('sounds/orangeGem.wav');
var heartSound = new Audio('sounds/heart.wav');
var keySound = new Audio('sounds/key.wav');
var transformSound = new Audio('sounds/transform.wav');
var untransformSound = new Audio('sounds/transform.wav');
var starBackgroundSound = new Audio('sounds/starPower.wav');


// misc game sound instances

var reachTopSound = new Audio('sounds/touchWater.wav');
var extraLifeSound = new Audio('sounds/extraLife.wav');
var gameOverSound = new Audio('sounds/gameOver.wav');
var completeLevelSound = new Audio('sounds/completeLevel.wav');
var pauseSound = new Audio('sounds/pause.mp3');
var unPauseSound = new Audio('sounds/unPause.mp3');
var spacebarClickSound = new Audio('sounds/spaceBarClick.wav');
var winGameSound = new Audio('sounds/winGame.wav');
var gameMusicSound = new Audio('sounds/gameMusic.mp3');
var introMusicSound = new Audio('sounds/introMusic.wav');


// initiate intro music and loop

introMusicSound.play();
introMusicSound.loop = true;