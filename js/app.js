// Create master-class
function Sprite(x, y, speed, right, left, bottom, top) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    // Set variables for enemy dimensions
    this.right = right;
    this.left = left;
    this.bottom = this.y + bottom;
    this.top = this.y + top;
}

// Create subclass Enemy
function Enemy(x, y, speed, right, left, bottom, top) {
    Sprite.call(this, x, y, speed, right, left, bottom, top);
    this.sprite = 'images/enemy-bug.png';
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
function evilerEnemy(x, y, speed, right, left, bottom, top) {
    Enemy.call(this, x, y, speed, right, left, bottom, top);
    this.sprite = 'images/enemy-bug3.png';
}

// Set Enemy prototype as a subclass of Enemy
evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

// Create subclass evilestEnemy
function evilestEnemy(x, y , speed, right, left, bottom, top) {
    Enemy.call(this, x, y, speed, right, left, bottom, top);
    this.sprite = 'images/enemy-bug2.png';
}

// Set evilestEnemy prototype as a subclass of Enemy
evilestEnemy.prototype = Object.create(Enemy.prototype);
evilestEnemy.prototype.constructor = evilestEnemy;

// Collision detection algorithm using box collision
function checkCollisions () {
    allEnemies.forEach(function(enemy) {
             if(enemy.x + enemy.left < player.x + player.right &&
                enemy.x + enemy.right > player.x + player.left &&
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

function Player(x, y, speed, right, left, bottom, top) {
    Sprite.call(this, x, y, speed, right, left, bottom, top);
    this.sprite = 'images/char-cartman.png';
}

// Set Player prototype as a subclass of Sprite
//Player.prototype = Object.create(Sprite.prototype);
//Player.prototype.constructor = Player;

// Set variables for enemy dimensions
Player.prototype.update = function(dt) {
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
    //x, y, speed, right, left, bottom, top
    new evilerEnemy(0, 30, 200, 100, 0, 100, 0),
    new evilestEnemy(0, 85, 100, 130, 0, 140, 50),
    new Enemy(0, 225, 300, 70, 0, 75, 0)
    ];

//x, y, speed, right, left, bottom, top
var player = new Player(200, 400, 0, 77, -15, 55, -25);

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

