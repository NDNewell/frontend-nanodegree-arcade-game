/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods for Player and Enemy objects (defined in app.js).

 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with
 */

var Engine = (function(global) {

    /* Predefine the variables within this scope, create the canvas element, grab the 2D context for that canvas, set the canvas elements height/width and add it to the DOM*/

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 675;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods
     */

    function main() {

        // Get  time delta information which is required for smooth animation 

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call update/render functions, pass along the time delta to
         * update function since it may be used for smooth animation.
         */

        update(dt);
        render();

        /* Set lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */

        lastTime = now;

        // check whether or not to stop the game depending on game conditions created in game play

        loopFilter();

        function loopFilter () {

            // if game play doesn't require a stop in animation, use the browser's requestAnimationFrame function to call 'main' again as soon as the browser is able to draw another frame to continue the game loop

            if (!stopGame) {

                win.requestAnimationFrame(main);

            // stop game loop and call the 'you win' canvas prompt

            } else if (winGame) {

              youWin();

            // stop game loop and call the 'level passed' canvas prompt

            } else if (goUplevel) {

              passLevel();

            // stop game loop and call the 'paused' canvas prompt

            } else if (pause) {

              pauseGame();

            // stop game loop and call the opening canvas prompt

            } else if (beginGame) {

              gameBegin();

            // stop game loop and call the 'game over' canvas prompt

            } else {

              gameOver();

            }

        }

        // whenver the game loop stops, the background music is paused

        if (stopGame) {

            gameMusicSound.pause();

        }

    };


    // set the lastTime variable that is required for the game loop and calls the main loop

    function init () {

        lastTime = Date.now();
        main();

    }


    //update entity data

    function update(dt) {

        updateEntities(dt);

        // clear player stats canvas (top of the canvas)

        clearStatsCanvas();

    }


    // update the data/properties related to each object

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


    // This function initially draws the "game level", then calls the render-Entities/Stats/RelicInfo functions. 

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

        /* Loop through the number of rows and columns defined above
         * and using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 0; row < numRows; row++) {

            for (col = 0; col < numCols; col++) {

                // Use drawImage function to draw images from cached Resources helpers to refer to our images

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);

            }

        }

        renderEntities();
        renderStats();
        renderRelicInfo();

    }


    // call the render functions you have defined for Enemy,Player, and Relic entities within app.js

    function renderEntities() {

        // Loop through allRelics array then call the render function 

        allRelics.forEach(function(relic) {

            relic.render();

        });

        // Loop through allEnemies array then call the render function 

        allEnemies.forEach(function(enemy) {

            enemy.render();

        });

        // Call the Player render function 

        player.render();

    }


    // draw prompt box describing game rules etc.

    function gameBegin () {

        // draw prompt box with a transparent fill

        ctx.rect(40, 75, 430, 590);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        // set content, text style, colour, and size for headlines

        ctx.font = "60px Impact";
        ctx.fillStyle = "Yellow";
        ctx.fillText("CARTMAN CRUSH", 55, 145);

        // set different size for bottom text

        ctx.font = "32px Impact";
        ctx.fillText("Press the Spacebar to begin!", 65, 650);

        // set content and different size and colour for instructions

        ctx.font = "25px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText("Cartman must reach the water 3 times", 55, 185);
        ctx.fillText("to pass each level. There are 4 levels.", 55, 215);
        ctx.fillText("Avoid the bugs:", 55, 265);
        ctx.fillText("Try to obtain the following items:", 55, 310);

        // set content and diffent colour for item descriptions

        ctx.fillStyle = "orange";
        ctx.fillText("500 pts", 145, 365);
        ctx.fillText("300 pts", 145, 445);
        ctx.fillText("100 pts", 145, 525);
        ctx.fillText("Pass Level", 335, 365);
        ctx.fillText("Extra life", 335, 445);
        ctx.fillText("Invincibility", 335, 525);
        ctx.fillText("Every 1000 pts = 1 extra life.", 120, 575);
        ctx.fillText("Press 'P' to Pause the Game", 120, 610);

        // add images

        ctx.drawImage(Resources.get('images/enemy-bug-begin.png'), 230, 200);
        ctx.drawImage(Resources.get('images/enemy-bug2-begin.png'), 300, 200);
        ctx.drawImage(Resources.get('images/enemy-bug3-begin.png'), 370, 200);

        ctx.drawImage(Resources.get('images/Gem-Green-sm.png'), 65, 300);
        ctx.drawImage(Resources.get('images/Gem-Orange-sm.png'), 65, 380);
        ctx.drawImage(Resources.get('images/Gem-Blue-sm.png'), 65, 460);

        ctx.drawImage(Resources.get('images/Key.png'), 255, 300);
        ctx.drawImage(Resources.get('images/Heart.png'), 255, 370);
        ctx.drawImage(Resources.get('images/Star.png'), 255, 460);

    }


    // draw Game Over prompt box

    function gameOver () {

        // draw prompt box with a transparent fill

        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        // set content, text style, colour, and size 

        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText("GAME OVER", 125, 170);

        // set content, text style, colour, and size 

        ctx.font = "30px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText("Press the Spacebar to Play Again", 55, 225);

    }


    // draw pause game prompt box

    function pauseGame () {

        // draw prompt box with a transparent fill

        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        // set content, text style, colour, and size 

        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText("PAUSED", 165, 190);

    }

    // draw win prompt box

    function youWin () {

        // draw prompt box with a transparent fill

        ctx.rect(40, 100, 430, 150);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        // set content, text style, colour, and size 

        ctx.font = "60px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText("YOU WIN!", 145, 170);

        // set content, text style, colour, and size 

        ctx.font = "30px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText("Press the Spacebar to Play Again", 55, 225);

    }


    // draw pass level prompt box

    function passLevel () {

        // draw prompt box with a transparent fill

        ctx.rect(40, 100, 430, 300);
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fill();

        // set number to reflect level passed

        var displayLevel = player.level -1;

        // set content, text style, colour, and size 

        ctx.font = "50px Impact";
        ctx.fillStyle = "yellow";
        ctx.fillText("YOU PASSED LEVEL", 80, 170);

        // set content, text style, and size 

        ctx.font = "80px Impact";
        ctx.fillText(displayLevel, 235, 260);

        // set content, text style, colour, and size 

        ctx.font = "40px Impact";
        ctx.fillStyle = "#7ACC52";
        ctx.fillText("Press the Spacebar", 95, 320);

        // set text size 

        ctx.font = "40px Impact";

            // change words 'final' and 'next' depending on level passed

            if(player.level === 4) {

                ctx.fillText("for the FINAL level !", 110, 365);

            } else {

                ctx.fillText("for the next level !", 110, 365);

            }

    }

    // draw players stats above game

    function renderStats() {

        // set y position for text

        var y = 45;

        // set content, text style, colour, and size 

        ctx.font = "35px Impact";
        ctx.fillStyle = "#70B8FF";
        ctx.fillText("LIVES:" + " " + player.lives, 10, y);

        // set content and text colour

        ctx.fillStyle = "#7ACC52";
        ctx.fillText("POINTS:" + " " + player.points, 175 , y);

        // set content and text colour

        ctx.fillStyle = "orange";

            // change words 'level' to 'winner' after Player wins

            if (player.level === 5) {

                ctx.fillText("WINNER", 385, y);

            } else {

                ctx.fillText("LEVEL:" + " " + player.level, 385, y);

            }

    }


    // draw Gem points above the Player when obtaining a gem and draw a countdown timer below the Player when getting a Star

    function renderRelicInfo  () {

        // when star power is enabled, draw content, text style, colour, and size

        if(starPower) {

            ctx.font = "35px Impact";
            ctx.fillStyle = "Yellow";
            ctx.fillStroke = "black";
            ctx.lineWidth = 1;
            ctx.fillText(starTime, player.x + 75, player.y + 190);
            ctx.strokeText(starTime, player.x + 75, player.y + 190);

        }

        // when Player gets a Gem, draw content, text style, colour, and size

        if(getGem) {

            ctx.font = "30px Impact";
            ctx.fillStyle = "white";
            ctx.fillStroke = "black";
            ctx.lineWidth = 1;
            ctx.fillText(gemValue, player.x + 30, player.y);
            ctx.strokeText(gemValue, player.x + 30, player.y);

        }

    }


    // clear the top part of the canvas (game stats)

    function clearStatsCanvas () {

        ctx.clearRect(0, 0, canvas.width, 50);

    }


    // clear the whole canvas

    function clearCanvas () {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }


    // load all of the images to draw game level, then set init as the callback method, so that when all of the images are properly loaded the game will start.

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

    // set game reset after game over, pause, game win, and level pass

    reset = function() {

        // reset game conditions/properties after game over or Player wins

        if (player.lives === 0 || winGame) {

            player.lives = 3;
            player.level = 1;
            player.touchWater = 0;
            player.points = 0;

            // reposition Player

            restartPlayer();

        }

        // reset global variables

        adjustSpeed = true;
        pause = false;
        stopGame = false;
        goUplevel = false;
        beginGame = false;
        winGame = false;

        // turn off beginning game music when game starts

        introMusicSound.pause();

        // initiate gameplay music and set loop

        gameMusicSound.play();
        gameMusicSound.loop = true;

        
        // clear the canvas to delete prompt boxes: game over, paused, win, and level pass and reset path/canvas formatting

        clearCanvas();
        ctx.beginPath();

        // restart game loop

        main();

    }

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */

    global.ctx = ctx;

})(this);
