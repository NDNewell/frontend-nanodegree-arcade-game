// Create master-class
function Sprite(x,y) {
  this.x = x;
  this.y = y;
}

// Create subclass Enemy
function Enemy(x, y, speed) {
    Sprite.call(this, x, y);
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
}

// Set Enemy prototype as a subclass of Sprite
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update enemy objects
Enemy.prototype.update = function(dt) {

// Set variables for enemy dimensions
    this.leftSide = this.x;
    this.rightSide = this.x + 70;
    this.top = this.y;
    this.bottom = this.y + 75;

// Update the enemy's position using time delta between ticks
    this.x += this.speed * dt;

// Parameter to reset enemy's position after moving off screen
    if(this.x > 505) {
        this.x = -100;
    }
}

// Create subclass evilerEnemy
function evilerEnemy(x,y,speed) {
    Enemy.call(this, x, y, speed);
    this.sprite = 'images/enemy-bug3.png';
}

// Set Enemy prototype as a subclass of Enemy
evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

// Create subclass evilestEnemy
function evilestEnemy(x,y,speed) {
    Enemy.call(this, x, y, speed);
    this.sprite = 'images/enemy-bug2.png';
}

// Set evilestEnemy prototype as a subclass of Enemy
evilestEnemy.prototype = Object.create(Enemy.prototype);
evilestEnemy.prototype.constructor = evilestEnemy;

// Collision detection algorithm using box collision
function checkCollisions () {
    allEnemies.forEach(function(enemy) {
             if(enemy.leftSide < player.rightSide &&
                enemy.rightSide > player.leftSide &&
                enemy.top < player.bottom &&
                enemy.bottom > player.top) {
                    console.log('collision!');
                  //Reset player position
                    player.startOver();
                }
            });
}

// Draw the enemies on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Create player subclass of Sprite

function Player(x,y) {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-cartman.png';
}

// Set Player prototype as a subclass of Sprite
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// Set variables for enemy dimensions
Player.prototype.update = function(dt) {
    this.leftSide = this.x - 15;
    this.rightSide = this.x + 77;
    this.top = this.y - 25;
    this.bottom = this.y + 100;
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Method for resetting player position
Player.prototype.startOver = function() {
    this.x = 200;
    this.y = 400;
}

// Key instructions for player movements
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            if(this.x > 0) {
                this.x-=25;
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
                this.y-=25;
            } else {
                this.startOver();
            }
            break;

        case 'down':
            if(this.y < 425) {
                this.y+=25;
            }
            break;
    }
}

// Instantiate objects
var allEnemies = [
    new evilerEnemy(0, 30, 150),
    new evilestEnemy(0, 85, 100),
    new Enemy(0, 225, 250)
    ];

var player = new Player();

// Listen for key presses and send the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

