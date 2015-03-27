// create class Enemy

function Enemy() {

    // set random horizontal position
    // generate a number in the range of 1 - 505.
    // eg. (Math.random * (max - min)) + min

    this.x = Math.floor((Math.random() * 505) + 1);
    this.y = 300;

    // set variables for enemy dimensions

    this.right = 70;
    this.left = 0;
    this.bottom = 75;
    this.top = 0;
    this.sprite = 'images/enemy-bug.png';

    // set random enemy speed
    // generate a number in the range of 50 - 115.
    // eg. (Math.random * (max - min)) + min

    this.speed = Math.floor((Math.random() * 65) + 50);

}

// update enemy objects

Enemy.prototype.update = function(dt) {

// check if speed needs to be adjusted for the specific level

if(adjustSpeed) {

    console.log("adjust speed");

      if(player.level === 1) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 50);
          });

          console.log("level 1 speed!");

      } else if (player.level ===2) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 115);
          });

          console.log("level 2 speed!");

      } else if (player.level ===3) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 180);
          });

          console.log("level 3 speed!");

      } else if (player.level ===4) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 245);
          });

          console.log("level 4 speed!");
      }

    adjustSpeed = false;

} 

// update the enemy's position using time delta between ticks

    this.x += this.speed * dt;


// parameter to reset enemy's position after moving off screen

    if(this.x > 505) {
        this.x = -100;
    }
}

// create subclass evilerEnemy

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

// set Enemy prototype as a subclass of Enemy

evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

// create subclass evilestEnemy

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
                            hey.play();
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
        sonOfa.play();
    }

    if(goUplevel) {
        removeStarPower();
        stopGame = true;
            if(player.level < 5) {
                completeLevelSound.play();
                respect.play();
            }
    }

    if(player.level === 5) {

        // if the player has star power invoked, this will check and get rid of it.

        if(starPower) {
            removeStarPower();
        }

        winGame = true;
        winGameSound.play();
        screwYou.play();
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

// create Relic class

function Relic() {

    // set random horizontal position
    // generate a number in the range of -500 to -1500
    // eg. (Math.random * (max - min)) + min

    this.x = -Math.floor((Math.random() * 1000) + 500);

    // set random vertical path
    // generate a number in the range of 1 - 4
    // eg. (Math.random * (max - min)) + min

    var randomPath = Math.floor((Math.random() * 4) + 1);

    // assign a specific path depending on the number generated from randomPath

        if(randomPath === 1) {

            this.y = 115;

        } else if (randomPath === 2) {

            this.y = 195;

        } else if (randomPath === 3) {

            this.y = 280;

        } else if (randomPath === 4) {

            this.y = 360;

        }

    // set random relic speed
    // generate a number in the range of 50 - 100
    // eg. (Math.random * (max - min)) + min

    this.speed = Math.floor((Math.random() * 50) + 50);

}

Relic.prototype.update = function(dt) {

// update the Relic's position using time delta between ticks
    this.x += this.speed * dt;


// reset Relic if it moves off the screen
    if(this.x > 505) {

      // set random starting point for x
      // key, Star, and Heart are reset to further points away in order to make them less common.

        if(this.sprite === 'images/Key.png') {

          this.x = -Math.floor((Math.random() * 2000) + 5000);

        } else if(this.sprite === 'images/Heart.png') {

          this.x = -Math.floor((Math.random() * 2000) + 5000);

        } else if(this.sprite === 'images/Star.png') {

          this.x = -Math.floor((Math.random() * 2000) + 5000);

        } else {


      // gems get set to the default starting point

          this.x = -Math.floor((Math.random() * 1000) + 500);

        }

        var randomPath = Math.floor((Math.random() * 4) + 1);

        if(randomPath === 1) {
          this.y = 115;
        } else if (randomPath === 2) {
          this.y = 195;
        } else if (randomPath === 3) {
          this.y = 280;
        } else if (randomPath === 4) {
          this.y = 360;
        }
    }

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
Gem.prototype.constructor = Gem;

function Key() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position (this is calculated with a larger range in order to reduce its frequency)
    // generate a number in the range of -2000 to -7000
    // eg. (Math.random * (max - min)) + min

    this.x = -Math.floor((Math.random() * 2000) + 5000);

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
Key.prototype.constructor = Key;

function Heart() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position (this is calculated with a larger range in order to reduce its frequency)
    // generate a number in the range of -2000 to -7000
    // eg. (Math.random * (max - min)) + min

    this.x = -Math.floor((Math.random() * 2000) + 5000);

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
Heart.prototype.constructor = Heart;

function Star() {

    // call prototype properties from Relic

    Relic.call(this);

    // set random horizontal position (this is calculated with a larger range in order to reduce its frequency)
    // generate a number in the range of -2000 to -7000
    // eg. (Math.random * (max - min)) + min

    this.x = -Math.floor((Math.random() * 2000) + 5000);

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
Star.prototype.constructor = Star;

// collision detection algorithm using box collision

function relicCollisions () {
    allRelics.forEach(function(relic) {
             if(relic.x + relic.left < player.x + player.right &&
                relic.x + relic.right > player.x + player.left &&
                relic.y + relic.top < player.y + player.bottom &&
                relic.y + relic.bottom > player.y + player.top) {

                  // set conditions for Gem collisions

                  if(relic.sprite === 'images/Gem-Blue-sm.png') {

                      blueGemSound.play();
                      getGem = true;
                      gemValue = 100;
                      player.points += gemValue;

                  } else if (relic.sprite === 'images/Gem-Orange-sm.png') {

                      orangeGemSound.play();
                      getGem = true;
                      gemValue = 300;
                      player.points += gemValue;

                  } else if (relic.sprite === 'images/Gem-Green-sm.png') {

                      greenGemSound.play();
                      getGem = true;
                      gemValue = 500;
                      player.points += gemValue;

                  // set conditions for special relic collisions

                  } else if (relic.sprite === 'images/Heart.png') {

                      player.lives++;
                      heartSound.play();
                      console.log('Extra life!');

                  } else if (relic.sprite === 'images/Star.png') {

                      starTime = 10;
                      var starTimer = setInterval(function() { 

                              starTime--;
                              console.log(starTime);

                              if(starTime <= 0 || player.level === 5) {
                                  if(!winGame && !goUplevel) {
                                    untransformSound.play();
                                  }
                                  collisionsOn = true;
                                  player.sprite = 'images/char-cartman.png';
                                  clearInterval(starTimer);
                                  starPower = false;
                              }

                            }, 1000);

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

                  } else if (relic.sprite === 'images/Key.png') {

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

                  // Set timer for how long Gem text (eg points) appears on screen

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

                // Reset random starting point for x
                // Key, Star, and Heart are reset to further points away in order to make them less common.

                  if(relic.sprite === 'images/Key.png') {

                    relic.x = -Math.floor((Math.random() * 2000) + 5000);

                  } else if(relic.sprite === 'images/Heart.png') {

                    relic.x = -Math.floor((Math.random() * 2000) + 5000);

                  } else if(relic.sprite === 'images/Star.png') {

                    relic.x = -Math.floor((Math.random() * 2000) + 5000);

                  } else {

                // Gems get set to the default starting point

                    relic.x = -Math.floor((Math.random() * 1000) + 500);

                  }

                  // set a random path for this.y for all relics

                  var randomPath = Math.floor((Math.random() * 4) + 1);

                  if(randomPath === 1) {
                    relic.y = 115;
                  } else if (randomPath === 2) {
                    relic.y = 195;
                  } else if (randomPath === 3) {
                    relic.y = 280;
                  } else if (randomPath === 4) {
                    relic.y = 360;
                  }
             }
    });
}

// Instantiate objects
var allEnemies = [

    new evilerEnemy(),
    new evilestEnemy(),
    new Enemy()
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

var hey = new Audio('sounds/hey.wav');
var respect = new Audio('sounds/respect.wav');
var screwYou = new Audio('sounds/screwYou.wav');
var sonOfa = new Audio('sounds/son_of_a.wav');


// Relic sound instances

var blueGemSound = new Audio('sounds/blueGem.wav');
var greenGemSound = new Audio('sounds/greenGem.wav');
var orangeGemSound = new Audio('sounds/orangeGem.wav');
var heartSound = new Audio('sounds/heart.wav');
var keySound = new Audio('sounds/key.wav');
var transformSound = new Audio('sounds/transform.wav');
var untransformSound = new Audio('sounds/transform.wav');
var starBackgroundSound = new Audio('sounds/starPower.wav');

// Other game sound instances

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


introMusicSound.play();
introMusicSound.loop = true;


