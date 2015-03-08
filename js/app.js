// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.leftSide = this.x;
    this.rightSide = this.x + 70;
    this.top = this.y;
    this.bottom = this.y + 75;
    this.x += this.speed * dt;

    if(this.x > 505) {
        this.x = -100;
    }
}

function evilerEnemy(x,y,speed) {
    Enemy.call(this, x, y, speed);
    this.sprite = 'images/enemy-bug.png';
}

evilerEnemy.prototype = Object.create(Enemy.prototype);
evilerEnemy.prototype.constructor = evilerEnemy;

function checkCollisions () {
    allEnemies.forEach(function(enemy) {
             if(enemy.leftSide < player.rightSide &&
                enemy.rightSide > player.leftSide &&
                enemy.top < player.bottom &&
                enemy.bottom > player.top) {
                    console.log('collision!');
                    player.startOver();
                }
            });
}


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player(x,y) {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(dt) {
    this.leftSide = this.x;
    this.rightSide = this.x + 60;
    this.top = this.y;
    this.bottom = this.y + 60;
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.startOver = function() {
    this.x = 200;
    this.y = 400;
}

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
            if(this.y > 5) {
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
    new evilerEnemy(0, 135, 250),
    new Enemy(0, 220, 150),
    new Enemy(0, 305, 100)
    ];

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

