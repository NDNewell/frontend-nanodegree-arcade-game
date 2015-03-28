// set global variables



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

    // reset enemy's position after moving off screen

    if(this.x > 505) {

        this.x = -100;

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

// Collision detection algorithm using box collision for enemies

function enemyCollisions () {
        if(collisionsOn) {
            allEnemies.forEach(function(enemy) {
                     if(enemy.x + enemy.left < player.x + player.right &&
                        enemy.x + enemy.right > player.x + player.left &&
                        enemy.y + enemy.top < player.y + player.bottom &&
                        enemy.y + enemy.bottom > player.y + player.top) {
                            console.log('collision!');
                          //Reset player position
                            heySound.play();
                            player.die();
                        }
                    });
          }
}

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

// set conditions for game continuence
Player.prototype.update = function(dt) {
    
    // Check player's lives
    if(player.lives === 0) {
        stopGame = true;
        gameOverSound.play();
        sonBitchSound.play();
    }

    if(goUplevel) {
        removeStarPower();
        stopGame = true;
            if(player.level < 5) {
                completeLevelSound.play();
                respectSound.play();
            }
    }

    if(player.level === 5) {

        // if the player has star power invoked, this will check and get rid of it.

        if(starPower) {
            removeStarPower();
        }

        winGame = true;
        winGameSound.play();
        screwYouSound.play();
        stopGame = true;
    }

    // give the player an extra life for every 1000 points
    if (player.points >= bonus*1000) {
        bonus ++;
        player.lives ++;
        extraLifeSound.play();
    }

    // whenver the game stops, the background music is paused
    if (stopGame) {
        gameMusicSound.pause();
    }
}

removeStarPower = function () {
    console.log("removing star power")
    player.sprite = 'images/char-cartman.png';
    starTime = 0;
    starPower = false;
    starBackgroundSound.pause();
}

// draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// method for ending game or taking player's life before starting over
// still need to create gameOver.render();
Player.prototype.die = function() {
    player.startOver();
    this.lives--;
}

// method for resetting player position
Player.prototype.startOver = function() {
    this.x = 200;
    this.y = 475;
}

// key instructions for player movements
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if(this.x > 0) {
                this.x -= 35;
            }
            break;

        case 'right':
            if(this.sprite === 'images/char-cartman-wizard.png') {
                if (this.x < 340) {
                this.x+=35;
                }
            } else {
                if (this.x < 400) {
                this.x+=35;
                }
            }
            break;

        case 'up':
        // when player reaches the water is reset to default position
            if(this.y > 25) {
                this.y -= 35;
            } else {
                this.points += 10;
                this.touchWater++;
                reachTopSound.play();

                    if(this.touchWater === 3) {
                      this.level++;
                      goUplevel = true;
                    }

                    if(this.touchWater === 6) {
                      this.level++;
                      goUplevel = true;
                    }

                    if(this.touchWater === 9) {
                      this.level++;
                      goUplevel = true;
                    }

                    if(this.touchWater === 12) {
                      this.level++;
                      goUplevel = true;
                    }
                this.startOver();
            }
            break;

        case 'down':
            if(this.y < 475) {
                this.y += 35;
            }
            break;

          case 'p':
            if (paused && !goUplevel && !winGame && player.lives > 0 && !beginGame) {
                unPauseSound.play();
                reset();
            } else if (!beginGame && !goUplevel && player.lives > 0) {
              pauseSound.play();
              stopGame = true;
              paused = true;
            }

            break;

        case 'space':
            if(player.lives === 0 || winGame || goUplevel || beginGame) {
                spacebarClickSound.play();
                reset();
            }

            break;
    } 
}


// listen for key presses and send the keys to
// Player.handleInput() method.
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

// set conditions for what happens after the player Collides with a Relic

Relic.prototype.collisionConditions = function () {

    if(this.sprite === 'images/Gem-Blue-sm.png') {

        blueGemSound.play();
        getGem = true;
        gemValue = 100;
        player.points += gemValue;

    } else if (this.sprite === 'images/Gem-Orange-sm.png') {

        orangeGemSound.play();
        getGem = true;
        gemValue = 300;
        player.points += gemValue;

    } else if (this.sprite === 'images/Gem-Green-sm.png') {

        greenGemSound.play();
        getGem = true;
        gemValue = 500;
        player.points += gemValue;

    // set conditions for special relic collisions

    } else if (this.sprite === 'images/Heart.png') {

        player.lives++;
        heartSound.play();
        console.log('Extra life!');

    } else if (this.sprite === 'images/Star.png') {

        // display time remaining for star power and reset player conditions/properties after time runs out

        starTimerDisplay();

        // set new star power player conditions characteristics

        transformSound.play();
        starBackgroundSound.play();
        player.sprite = 'images/char-cartman-wizard.png';
        player.right = 100;
        player.left = -15;
        player.bottom = 70;
        player.top = -25;
        collisionsOn = false;
        starPower = true;
        console.log('invincibility!');

    } else if (this.sprite === 'images/Key.png') {

        keySound.play();
        player.level++;
        goUplevel = true;

        if(player.level === 2) {
          player.touchWater = 3;
        } else if (player.level === 3) {
          player.touchWater = 6;
        } else if (player.level === 4) {
          player.touchWater = 9;
        } else if (player.level === 5) {
          player.touchWater = 12;
        }

        player.startOver();
        console.log('You unlocked the next level!');

    }

    // set points display timer

    pointsDisplay ();

}

// draw the Relic on the screen

Relic.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// create Gem subclass of Relic

function Gem(spriteImg) {

    // call prototype properties from Relic

    Relic.call(this);

    // set variable dimensions for Gem

    this.right = 20;
    this.left = -10;
    this.bottom = 20;
    this.top = -40;

    // set Gem image

    this.sprite = spriteImg;

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

// collision detection algorithm for Relics using box collision

function relicCollisions () {

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

// set a random number within a given range

function randomRange (max, min) {

    // generate a number between min and max for objects' x and y positions, and speeds

    return Math.floor((Math.random() * (max - min)) + min);

}

// set timer for how long points appear on screen after obtaining a Gem

function pointsDisplay () {

    // if a Gem has been collected, getGem will be true, intiating the timer

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

function starTimerDisplay () {

    starTime = 10;

    var starTimer = setInterval(function() { 

        starTime--;

        // if timer gets to zero or the player wins the game, the timer resets the original player properties/conditions

        if(starTime <= 0 || player.level === 5) {

            // the untransform sound is only played if the player hasn't completed a level or won the game so as not to interfere with game sounds (eg. passing a level, game over, or winning the game)

            if(!winGame && !goUplevel) {

                untransformSound.play();

            }

            clearInterval(starTimer);

            // reset the original player properties/conditions

            starPower = false;
            collisionsOn = true;
            player.sprite = 'images/char-cartman.png';

        }

          }, 1000);

}

// instantiate objects

var allEnemies = [

    new evilerEnemy(),
    new evilestEnemy(),
    new evilEnemy()
    ];

var player = new Player();

var allRelics = [

    new Gem('images/Gem-Blue-sm.png'),
    new Gem('images/Gem-Orange-sm.png'),
    new Gem('images/Gem-Green-sm.png'),
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