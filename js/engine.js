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

    stopGame = false;
    goUplevel = false;
    winGame = false;
    paused = false;
    adjustSpeed = false;
    collisionsOn = true;

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
                } else {
                  gameOver();
                }
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
         enemyCollisions();
          relicCollisions();
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
        });

        allRelics.forEach(function(relic) {
            relic.update(dt);
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

      // Draw Game Over prompt box
    function gameOver () {
        console.log("Draw Game Over Box");
        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set prompt text
        var prompts = ["GAME OVER", "Press the spacebar to Play Again"]
        
        //Draw prompt: 'GAME OVER'
        console.log("Draw Game Over Text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[0], 125, 170);

        //Draw prompt: 'Press spacebar to Continue
        console.log("Draw Continue Text");
        ctx.font = "30px Impact";
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
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[0], 165, 190);
    }

      // Draw you win prompt box
    function youWin () {

        console.log("Draw winner box");
        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        //Set prompt text
        var prompts = ["YOU WIN!", "Press the spacebar to Play Again"]
        
        //Draw prompt: 'YOU WIN!'
        console.log("Draw winner text");
        ctx.font = "60px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[0], 145, 170);

        //Draw prompt: 'Press spacebar to Continue
        console.log("Draw continue text");
        ctx.font = "30px Impact";
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
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[0], 80, 170);

        //Draw text: 'level number'
        console.log("Draw level number text");
        ctx.font = "80px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[1], 235, 260);

        //Draw text: 'Press the spacebar'
        ctx.font = "40px Impact";
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
        // Draw lives text
        var prompts = ["LIVES:" + " " + player.lives, "POINTS:" + " " + player.points, "LEVEL:" + " " + player.level]

        ctx.font = "35px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[0], 1, 35);

        // Draw points text
        ctx.font = "35px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[1], 180 , 35);

        // Draw level text
        ctx.font = "35px Impact";
        ctx.fillStyle = "#47B224";
        ctx.fillText(prompts[2], 390, 35);
    }

    //clears the canvas so text doesn't get blurry
    function clearCanvas () {
        ctx.clearRect(0, 0, canvas.width, 50);
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
        'images/Star.png'
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
                player.startOver();
                adjustSpeed = true;

            } else if (winGame) {
                player.lives = 3;
                player.level = 1;
                player.touchWater = 0;
                winGame = false;
                player.startOver();
            }

        adjustSpeed = true;
        paused = false;
        stopGame = false;
        goUplevel = false;

        //reset path
        ctx.beginPath();

        main();
    }

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
