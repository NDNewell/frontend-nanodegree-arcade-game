// Create master-class
function Sprite(right, left, bottom, top, spriteImg) {
    // Set variables for enemy dimensions
    this.right = right;
    this.left = left;
    this.bottom = bottom;
    this.top = top;
    this.sprite = spriteImg;
    // generate a number in the range of 100 - 300.
    // eg. (Math.random * (max - min)) + min
    this.speed = Math.floor((Math.random() * 65) + 100);
}

// Create subclass Enemy
function Enemy(right, left, bottom, top, spriteImg) {
    Sprite.call(this, right, left, bottom, top, spriteImg);
    this.x = Math.floor((Math.random() * 505) + 1);
    this.y = 300;
}

// Set Enemy prototype as a subclass of Sprite
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update enemy objects
Enemy.prototype.update = function(dt) {

// Check if speed needs to be adjusted for the specific level
if(adjustSpeed) {

    console.log("adjust speed");

      if(player.level === 1) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 100);
          });

          console.log("level 1 speed!");

      } else if (player.level ===2) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 165);
          });

          console.log("level 2 speed!");

      } else if (player.level ===3) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 230);
          });

          console.log("level 3 speed!");

      } else if (player.level ===4) {
          allEnemies.forEach(function(enemy) {
            enemy.speed = Math.floor((Math.random() * 65) + 295);
          });

          console.log("level 4 speed!");
      }

    adjustSpeed = false;

} 

// Update the enemy's position using time delta between ticks
    this.x += this.speed * dt;


// Parameter to reset enemy's position after moving off screen
    if(this.x > 505) {
        this.x = -100;
    }
}

// Create subclass evilerEnemy
function evilerEnemy(right, left, bottom, top, spriteImg) {
    Enemy.call(this, right, left, bottom, top, spriteImg);
    this.y = 30;
}

// Set Enemy prototype as a subclass of Enemy
evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

// Create subclass evilestEnemy
function evilestEnemy(right, left, bottom, top, spriteImg) {
    Enemy.call(this, right, left, bottom, top, spriteImg);
    this.y = 125;
}

// Set evilestEnemy prototype as a subclass of Enemy
evilestEnemy.prototype = Object.create(Enemy.prototype);
evilestEnemy.prototype.constructor = evilestEnemy;

// Collision detection algorithm using box collision for enemies
function enemyCollisions () {
    allEnemies.forEach(function(enemy) {
             if(enemy.x + enemy.left < player.x + player.right &&
                enemy.x + enemy.right > player.x + player.left &&
                enemy.y + enemy.top < player.y + player.bottom &&
                enemy.y + enemy.bottom > player.y + player.top) {
                    console.log('collision!');
                  //Reset player position
                    player.die();
                }
            });
}

// Draw the enemies on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Create player subclass of Sprite

function Player(right, left, bottom, top, spriteImg) {
    Sprite.call(this, right, left, bottom, top, spriteImg);
    this.lives = 3;
    this.points = 0;
    this.level = 1;
    this.touchWater = 0;
    this.x = 200;
    this.y = 475;
}

// Set Player prototype as a subclass of Sprite
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// Set conditions for game continuence
Player.prototype.update = function(dt) {
  // Check player's lives
    if(player.lives === 0) {
        stopGame = true;
    }

    if(goUplevel) {
        stopGame = true;
    }

    if(player.level === 5) {
        winGame = true;
        stopGame = true;
    }
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Method for ending game or taking player's life before starting over
// Still need to create gameOver.render();
Player.prototype.die = function() {
    player.startOver();
    this.lives--;
}

// Method for resetting player position
Player.prototype.startOver = function() {
    this.x = 200;
    this.y = 475;
}

// Key instructions for player movements
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if(this.x > 0) {
                this.x -= 35;
            }
            break;

        case 'right':
            if(this.x < 400) {
                this.x+=35;
            }
            break;

        case 'up':
        // when player reaches the water is reset to default position
            if(this.y > 25) {
                this.y -= 35;
            } else {
                this.points += 10;
                this.touchWater++;

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
            if (paused && !goUplevel && !winGame && player.lives > 0) {
                reset();
            } else {
              stopGame = true;
              paused = true;
            }

            break;

        case 'space':
            if(player.lives === 0 || winGame || goUplevel) {
                reset();
            }

            break;
    } 
}


// Listen for key presses and send the keys to
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


// Create Gem subclass of Sprite

function Gem(right, left, bottom, top, spriteImg) {
    Sprite.call(this, right, left, bottom, top, spriteImg);
    this.speed = Math.floor((Math.random() * 50) + 50);
    this.x = -Math.floor((Math.random() * 2000) + 1000);

// set a random path for this.y
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

// Set Gem prototype as a subclass of Sprite
Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function(dt) {

// Update the gems's position using time delta between ticks
    this.x += this.speed * dt;


// Reset gem if it moves off the screen
    if(this.x > 505) {

        // set random x and y coordinates for gem

        this.x = -Math.floor((Math.random() * 2000) + 1000);

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

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}

function orangeGem(right, left, bottom, top, spriteImg) {
    Gem.call(this, right, left, bottom, top, spriteImg);
} 

// Set orangeGem prototype as a subclass of Gem
orangeGem.prototype = Object.create(Gem.prototype);
orangeGem.prototype.constructor = orangeGem;

function greenGem(right, left, bottom, top, spriteImg) {
    Gem.call(this, right, left, bottom, top, spriteImg);
} 

// Set greenGem prototype as a subclass of Gem
greenGem.prototype = Object.create(Gem.prototype);
greenGem.prototype.constructor = greenGem;

function blueGem(right, left, bottom, top, spriteImg) {
    Gem.call(this, right, left, bottom, top, spriteImg);
} 

// Set blueGem prototype as a subclass of Gem
blueGem.prototype = Object.create(Gem.prototype);
blueGem.prototype.constructor = blueGem;

// Collision detection algorithm using box collision
function gemCollisions () {
    allGems.forEach(function(gem) {
             if(gem.x + gem.left < player.x + player.right &&
                gem.x + gem.right > player.x + player.left &&
                gem.y + gem.top < player.y + player.bottom &&
                gem.y + gem.bottom > player.y + player.top) {

                 if(gem.sprite === 'images/Gem-Blue-sm.png') {
                    player.points += 100;
                    console.log('You got a blue gem!');
                 } else if (gem.sprite === 'images/Gem-Orange-sm.png') {
                    player.points += 300;
                    console.log('You got an orange gem!');
                 } else {
                    player.points += 500;
                    console.log('You got a green gem!');
                 }

                // set random starting point
                  gem.x = -Math.floor((Math.random() * 2000) + 1000);

                  // set a random path for this.y

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
    });
}

// Instantiate objects
var allEnemies = [
                    // y, right, left, bottom, top, spriteImg
    new evilerEnemy(100, 0, 100, 0, 'images/enemy-bug3.png'),
    new evilestEnemy(130, 0, 140, 50, 'images/enemy-bug2.png'),
    new Enemy(70, 0, 75, 0, 'images/enemy-bug.png')
    ];

                    // right, left, bottom, top, spriteImg
var player = new Player(77, -15, 55, -25, 'images/char-cartman.png');

var allGems = [

    new blueGem(20, 20, 20, -40, 'images/Gem-Blue-sm.png'),
    new orangeGem(20, 20, 20, -40, 'images/Gem-Orange-sm.png'),
    new greenGem(20, 20, 20, -40, 'images/Gem-Green-sm.png')
    ];