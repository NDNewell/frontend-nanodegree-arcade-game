/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;


    goUplevel = false;
    winGame = false;
    paused = false;
    adjustSpeed = false;
    collisionsOn = true;
    bonus = 1;
    stopGame = true;
    beginGame = true;
    getGem = false;
    starPower = false;

    canvas.width = 505;
    canvas.height = 675;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        animationCheck();

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        function animationCheck () {
                if (!stopGame) {
                  win.requestAnimationFrame(main);
                } else if (winGame) {
                  youWin();
                } else if (goUplevel) {
                  passLevel();
                } else if (paused) {
                  pauseGame();
                } else if (beginGame) {
                  gameBegin();
                } else {
                  gameOver();
                }
            }

        // whenver the game stops, the background music is paused

        if (stopGame) {

            gameMusicSound.pause();

        }

    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init () {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        clearCanvas();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            enemy.collisions();
        });

        allRelics.forEach(function(relic) {
            relic.update(dt);
            relic.collisions();
        });

        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

            var rowImages = [
                    'images/water-block.png',   // Top row is water
                    'images/stone-block.png',   // Row 1 of 4 of stone
                    'images/stone-block.png',   // Row 2 of 4 of stone
                    'images/stone-block.png',   // Row 3 of 4 of stone
                    'images/stone-block.png',   // Row 4 of 4 of stone
                    'images/grass-block.png',   // Row 1 of 2 of grass
                    'images/grass-block.png'    // Row 2 of 2 of grass
                ],
                numRows = 7,
                numCols = 5,
                row, col;

            /* Loop through the number of rows and columns we've defined above
             * and, using the rowImages array, draw the correct image for that
             * portion of the "grid"
             */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }


            renderEntities();
            renderStats();
            renderRelicInfo();

    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        allRelics.forEach(function(relic) {
            relic.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();


    }
      // Draw gameBegin prompt box
    function gameBegin () {
        console.log("Draw game begin box");
        ctx.rect(40, 75, 430, 590);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set number to reflect level passed
        var displayLevel = player.level -1;
        //Set prompt text
        var prompts = ["CARTMAN CRUSH", "Cartman must reach the water 3 times", "to pass each level. There are 4 levels.", "Try to obtain the following items:", "500 pts", "300 pts", "100 pts", "Pass Level", "Extra life", "Invincibility", "Every 1000 pts = 1 extra life.", "Press the Spacebar to begin!", "Avoid the bugs:", "Press 'P' to Pause the Game"]

        //Draw text: 'Welcome screen'
        console.log("Draw game begin text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "Yellow";
        ctx.fillText(prompts[0], 55, 145);
        ctx.font = "32px Impact";
        ctx.fillText(prompts[11], 65, 650);
        ctx.font = "25px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText(prompts[1], 55, 185);
        ctx.fillText(prompts[2], 55, 215);
        ctx.fillText(prompts[12], 55, 265);
        ctx.drawImage(Resources.get('images/enemy-bug-begin.png'), 230, 200);
        ctx.drawImage(Resources.get('images/enemy-bug2-begin.png'), 300, 200);
        ctx.drawImage(Resources.get('images/enemy-bug3-begin.png'), 370, 200);
        ctx.fillText(prompts[3], 55, 310);
        ctx.fillStyle = "orange";
        ctx.drawImage(Resources.get('images/Gem-Green-sm.png'), 65, 300);
        ctx.drawImage(Resources.get('images/Gem-Orange-sm.png'), 65, 380);
        ctx.drawImage(Resources.get('images/Gem-Blue-sm.png'), 65, 460);
        ctx.drawImage(Resources.get('images/Key.png'), 255, 300);
        ctx.drawImage(Resources.get('images/Heart.png'), 255, 370);
        ctx.drawImage(Resources.get('images/Star.png'), 255, 460);
        ctx.fillText(prompts[4], 145, 365);
        ctx.fillText(prompts[5], 145, 445);
        ctx.fillText(prompts[6], 145, 525);
        ctx.fillText(prompts[7], 335, 365);
        ctx.fillText(prompts[8], 335, 445);
        ctx.fillText(prompts[9], 335, 525);
        ctx.fillText(prompts[10], 120, 575);
        ctx.fillText(prompts[13], 120, 610);

        console.log("Begin the game!");
    }

      // Draw Game Over prompt box
    function gameOver () {
        console.log("Draw Game Over Box");
        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set prompt text
        var prompts = ["GAME OVER", "Press the Spacebar to Play Again"]
        
        //Draw prompt: 'GAME OVER'
        console.log("Draw Game Over Text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText(prompts[0], 125, 170);

        //Draw prompt: 'Press spacebar to Continue
        console.log("Draw Continue Text");
        ctx.font = "30px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText(prompts[1], 55, 225);
        console.log("Game Over!");
    }

          // Draw pause game prompt box
    function pauseGame () {
        console.log("Draw pause box");
        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set prompt text
        var prompts = ["PAUSED"]
        
        //Draw prompt: 'GAME OVER'
        console.log("Draw pause text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText(prompts[0], 165, 190);
    }

      // Draw you win prompt box
    function youWin () {

        console.log("Draw winner box");
        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set prompt text
        var prompts = ["YOU WIN!", "Press the Spacebar to Play Again"]
        
        //Draw prompt: 'YOU WIN!'
        console.log("Draw winner text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText(prompts[0], 145, 170);

        //Draw prompt: 'Press spacebar to Continue
        console.log("Draw continue text");
        ctx.font = "30px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText(prompts[1], 55, 225);
        console.log("You Win!");
    }

      // Draw pass level prompt box
    function passLevel () {
        console.log("Draw pass level box");
        ctx.rect(40, 100, 430, 300);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set number to reflect level passed
        var displayLevel = player.level -1;
        //Set prompt text
        var prompts = ["YOU PASSED LEVEL", displayLevel, "Press the Spacebar", "for the next level !", "for the FINAL level !"]
        //Draw text: 'You passed level'
        console.log("Draw pass level text");
        ctx.font = "50px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText(prompts[0], 80, 170);

        //Draw text: 'level number'
        console.log("Draw level number text");
        ctx.font = "80px Impact";
        ctx.fillText(prompts[1], 235, 260);

        //Draw text: 'Press the spacebar'
        ctx.font = "40px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText(prompts[2], 95, 320);

        //Draw text: 'to Continue'
        console.log("Draw continue text");
        ctx.font = "40px Impact";
            if(player.level === 4) {
                ctx.fillText(prompts[4], 110, 365);
            } else {
                ctx.fillText(prompts[3], 110, 365);
            }
        console.log("Level Passed!");
    }
        
    function renderStats() {

        var prompts = ["LIVES:" + " " + player.lives, "POINTS:" + " " + player.points, "LEVEL:" + " " + player.level, "WINNER"]

        var y = 45;
        // Draw lives text
        ctx.font = "35px Impact";
        ctx.fillStyle = "#70B8FF";
        ctx.fillText(prompts[0], 10, y);

        // Draw points text
        ctx.fillStyle = "#7ACC52";
        ctx.fillText(prompts[1], 175 , y);

        // Draw level text;
        ctx.fillStyle = "orange";
            if (player.level === 5) {
                ctx.fillText(prompts[3], 385, y);
            } else {
                ctx.fillText(prompts[2], 385, y);
            }
    }

    function renderRelicInfo  () {

        if(starPower) {
            ctx.font = "35px Impact";
            ctx.fillStyle = "Yellow";
            ctx.fillStroke = "black";
            ctx.lineWidth = 1;
            ctx.fillText(starTime, player.x + 75, player.y + 190);
            ctx.strokeText(starTime, player.x + 75, player.y + 190);
        }

        if(getGem) {
            ctx.font = "30px Impact";
            ctx.fillStyle = "white";
            ctx.fillStroke = "black";
            ctx.lineWidth = 1;
            ctx.fillText(gemValue, player.x + 30, player.y);
            ctx.strokeText(gemValue, player.x + 30, player.y);
        }

    }

    //clears the canvas so text doesn't get blurry
    function clearCanvas () {
        ctx.clearRect(0, 0, canvas.width, 680);
    }
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug2.png',
        'images/enemy-bug3.png',
        'images/char-cartman.png',
        'images/Gem-Blue-sm.png',
        'images/Gem-Orange-sm.png',
        'images/Gem-Green-sm.png',
        'images/Key.png',
        'images/Heart.png',
        'images/Star.png',
        'images/char-cartman-wizard.png',
        'images/enemy-bug-begin.png',
        'images/enemy-bug2-begin.png',
        'images/enemy-bug3-begin.png'
    ]);
    Resources.onReady(init);

        /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    reset = function() {
        console.log("Game Reset");
            if (player.lives === 0) {
                player.points = 0; 
                player.lives = 3;
                player.level = 1;
                player.touchWater = 0;
                restartPlayer();
                adjustSpeed = true;

            } else if (winGame) {
                player.lives = 3;
                player.level = 1;
                player.touchWater = 0;
                winGame = false;
                restartPlayer();
            }

        adjustSpeed = true;
        paused = false;
        stopGame = false;
        goUplevel = false;
        beginGame = false;
        starPower = false;

        introMusicSound.pause();

        gameMusicSound.play();
        gameMusicSound.loop = true;

        //reset path/canvas formatting
        ctx.beginPath();

        main();
    }

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
