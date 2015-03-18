// Create master-class
function Sprite(x, y, speed, right, left, bottom, top, spriteImg) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    // Set variables for enemy dimensions
    this.right = right;
    this.left = left;
    this.bottom = bottom;
    this.top = top;
    this.sprite = spriteImg;
}

// Create subclass Enemy
function Enemy(x, y, speed, right, left, bottom, top, spriteImg) {
    Sprite.call(this, x, y, speed, right, left, bottom, top, spriteImg);
}

// Set Enemy prototype as a subclass of Sprite
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update enemy objects
Enemy.prototype.update = function(dt) {

// Update the enemy's position using time delta between ticks
    this.x += this.speed * dt;

// Parameter to reset enemy's position after moving off screen
    if(this.x > 505) {
        this.x = -100;
    }
}

// Create subclass evilerEnemy
function evilerEnemy(x, y, speed, right, left, bottom, top, spriteImg) {
    Enemy.call(this, x, y, speed, right, left, bottom, top, spriteImg);
}

// Set Enemy prototype as a subclass of Enemy
evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

// Create subclass evilestEnemy
function evilestEnemy(x, y , speed, right, left, bottom, top, spriteImg) {
    Enemy.call(this, x, y, speed, right, left, bottom, top, spriteImg);
}

// Set evilestEnemy prototype as a subclass of Enemy
evilestEnemy.prototype = Object.create(Enemy.prototype);
evilestEnemy.prototype.constructor = evilestEnemy;

// Collision detection algorithm using box collision
function checkCollisions () {
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

function Player(x, y, speed, right, left, bottom, top, spriteImg) {
    Sprite.call(this, x, y, speed, right, left, bottom, top, spriteImg);
    this.lives = 3;
    this.points = 0;
    this.level = 1;
    this.completion = 0;
}

// Set Player prototype as a subclass of Sprite
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// Set variables for enemy dimensions
Player.prototype.update = function(dt) {
  // Check player's lives
    if(player.lives === 0) {
        game_over = true;
    }
}

/*function levelComplete () {

    if(this.completion === 3) {
      this.level++;
    }
    if(this.completion === 6) {
      this.level++;
    }
    if(this.completion === 9) {
      this.level++;
    }
    if(this.completion === 12) {
      this.level++;
    }
    if(this.completion === 15) {
      this.level++;
    }
} */

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
                this.x -= 25;
            }
            break;

        case 'right':
            if(this.x < 400) {
                this.x+=25;
            }
            break;

        case 'up':
        // when player reaches the water is reset to default position
            if(this.y > 25) {
                this.y -= 25;
            } else {
                this.points += 10;
                this.completion++;

                    if(this.completion === 3) {
                      this.level++;
                    }

                    if(this.completion === 6) {
                      this.level++;
                    }

                    if(this.completion === 9) {
                      this.level++;
                    }

                    if(this.completion === 12) {
                      this.level++;
                    }
                //levelComplete();
                this.startOver();
            }
            break;

        case 'down':
            if(this.y < 475) {
                this.y += 25;
            }
            break;

        case 'space':
            if(game_over) {
                reset();
            }
    } 
}

// Instantiate objects
var allEnemies = [
                    // x, y, speed, right, left, bottom, top, spriteImg
    new evilerEnemy(0, 30, 200, 100, 0, 100, 0, 'images/enemy-bug3.png'),
    new evilestEnemy(0, 125, 100, 130, 0, 140, 50, 'images/enemy-bug2.png'),
    new Enemy(0, 300, 300, 70, 0, 75, 0, 'images/enemy-bug.png')
    ];

                    // x, y, speed, right, left, bottom, top, spriteImg
var player = new Player(200, 475, 0, 77, -15, 55, -25, 'images/char-cartman.png');

// Listen for key presses and send the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

