function Enemy(){this.x=randomRange(505,1),this.speed=randomRange(115,50)}function evilEnemy(){Enemy.call(this),this.y=300,this.right=70,this.left=0,this.bottom=75,this.top=0,this.sprite="images/enemy-bug.png"}function evilerEnemy(){Enemy.call(this),this.y=30,this.right=100,this.left=0,this.bottom=100,this.top=0,this.sprite="images/enemy-bug3.png"}function evilestEnemy(){Enemy.call(this),this.y=125,this.right=130,this.left=0,this.bottom=140,this.top=50,this.sprite="images/enemy-bug2.png"}function Player(){this.x=200,this.y=475,this.right=77,this.left=-15,this.bottom=55,this.top=-25,this.sprite="images/char-cartman.png",this.lives=3,this.points=0,this.level=1,this.touchWater=0}function Relic(){this.x=randomRange(-1500,-500);var e=randomRange(5,1);1===e?this.y=115:2===e?this.y=195:3===e?this.y=280:4===e&&(this.y=360),this.speed=randomRange(100,50)}function Gem(e,t){Relic.call(this),this.right=20,this.left=-10,this.bottom=20,this.top=-40,this.sprite=e,this.value=t}function Key(){Relic.call(this),this.x=randomRange(-5e3,-3e3),this.right=10,this.left=-5,this.bottom=0,this.top=-40,this.sprite="images/Key.png"}function Heart(){Relic.call(this),this.x=randomRange(-5e3,-3e3),this.right=30,this.left=-5,this.bottom=10,this.top=-65,this.sprite="images/Heart.png"}function Star(){Relic.call(this),this.x=randomRange(-5e3,-3e3),this.right=15,this.left=0,this.bottom=5,this.top=-25,this.sprite="images/Star.png"}function randomRange(e,t){return Math.floor(Math.random()*(e-t)+t)}function speedAdjust(){adjustSpeed&&(1===player.level?allEnemies.forEach(function(e){e.speed=randomRange(115,50)}):2===player.level?allEnemies.forEach(function(e){e.speed=randomRange(180,115)}):3===player.level?allEnemies.forEach(function(e){e.speed=randomRange(245,180)}):4===player.level&&allEnemies.forEach(function(e){e.speed=randomRange(310,245)}),adjustSpeed=!1)}function die(){heySound.play(),player.lives--,restartPlayer()}function restartPlayer(){player.x=200,player.y=475}function checkLives(){0===player.lives&&(stopGame=!0,gameOverSound.play(),sonBitchSound.play())}function checkLevel(){goUplevel&&(disableStarPower(),stopGame=!0,player.level<5?(completeLevelSound.play(),respectSound.play()):(winGame=!0,winGameSound.play(),screwYouSound.play()))}function pointsDisplay(){if(getGem){gemTime=1;var e=setInterval(function(){gemTime--,gemTime<=0&&(clearInterval(e),getGem=!1)},1e3)}}function starTimerDisplay(e){starTime=e;var t=setInterval(function(){starTime--,pause&&(starTime=savedStarTime),(starTime<=0||5===player.level)&&(winGame||goUplevel||pause||untransformSound.play(),clearInterval(t),disableStarPower())},1e3)}function disableStarPower(){starPower=!1,player.sprite="images/char-cartman.png",player.right=77,player.left=-15,player.bottom=55,player.top=-25,goUplevel&&(starTime=0,starBackgroundSound.pause())}var goUplevel=!1,winGame=!1,pause=!1,adjustSpeed=!1,collisionsOn=!0,bonus=1,stopGame=!0,beginGame=!0,getGem=!1,starPower=!1,savedStarTime=0;Enemy.prototype.update=function(e){this.x+=this.speed*e,speedAdjust(),this.x>505&&(this.x=-100)},Enemy.prototype.collisions=function(){starPower||allEnemies.forEach(function(e){e.x+e.left<player.x+player.right&&e.x+e.right>player.x+player.left&&e.y+e.top<player.y+player.bottom&&e.y+e.bottom>player.y+player.top&&die()})},evilEnemy.prototype=Object.create(Enemy.prototype),evilEnemy.prototype.constructor=evilEnemy,evilerEnemy.prototype=Object.create(Enemy.prototype),evilerEnemy.prototype.constructor=evilerEnemy,evilestEnemy.prototype=Object.create(Enemy.prototype),evilestEnemy.prototype.constructor=evilestEnemy,Enemy.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)},Player.prototype.update=function(){checkLives(),checkLevel(),this.points>=1e3*bonus&&(bonus++,this.lives++,extraLifeSound.play())},Player.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)},Player.prototype.handleInput=function(e){var t=35;switch(e){case"left":this.x>0&&!pause&&(this.x-=t);break;case"right":"images/char-cartman-wizard.png"===this.sprite?this.x<340&&!pause&&(this.x+=t):this.x<400&&!pause&&(this.x+=t);break;case"up":this.y>25&&!pause?this.y-=t:pause||(this.touchWater++,this.points+=10,reachTopSound.play(),this.touchWater>=3*this.level&&(this.level++,goUplevel=!0),restartPlayer());break;case"down":this.y<475&&!pause&&(this.y+=t);break;case"p":!pause&&!beginGame&&!goUplevel&&player.lives>0?(pauseSound.play(),stopGame=!0,pause=!0,starPower&&(savedStarTime=starTime)):pause&&(unPauseSound.play(),reset());break;case"space":(0===player.lives||winGame||goUplevel||beginGame)&&(spacebarClickSound.play(),reset())}},document.addEventListener("keyup",function(e){var t={32:"space",37:"left",38:"up",39:"right",40:"down",80:"p"};player.handleInput(t[e.keyCode])}),Relic.prototype.update=function(e){this.x+=this.speed*e,this.x>505&&this.reset()},Relic.prototype.reset=function(){this.x="images/Key.png"===this.sprite||"images/Heart.png"===this.sprite||"images/Star.png"===this.sprite?randomRange(-5e3,-3e3):randomRange(-500,-1500);var e=randomRange(5,1);1===e?this.y=115:2===e?this.y=195:3===e?this.y=280:4===e&&(this.y=360)},Relic.prototype.collisions=function(){allRelics.forEach(function(e){e.x+e.left<player.x+player.right&&e.x+e.right>player.x+player.left&&e.y+e.top<player.y+player.bottom&&e.y+e.bottom>player.y+player.top&&(e.collisionConditions(),e.reset())})},Relic.prototype.collisionConditions=function(){"images/Gem-Blue-sm.png"===this.sprite||"images/Gem-Orange-sm.png"===this.sprite||"images/Gem-Green-sm.png"===this.sprite?("images/Gem-Blue-sm.png"===this.sprite?blueGemSound.play():"images/Gem-Orange-sm.png"===this.sprite?orangeGemSound.play():"images/Gem-Green-sm.png"===this.sprite&&greenGemSound.play(),getGem=!0,gemValue=this.value,player.points+=gemValue,pointsDisplay()):"images/Heart.png"===this.sprite?(player.lives++,heartSound.play()):"images/Star.png"===this.sprite?(transformSound.play(),starBackgroundSound.play(),starPower=!0,starTimerDisplay(10),player.sprite="images/char-cartman-wizard.png",player.right=100,player.left=-15,player.bottom=70,player.top=-25):"images/Key.png"===this.sprite&&(keySound.play(),player.level++,goUplevel=!0,2===player.level?player.touchWater=3:3===player.level?player.touchWater=6:4===player.level?player.touchWater=9:5===player.level&&(player.touchWater=12),restartPlayer())},Relic.prototype.render=function(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)},Gem.prototype=Object.create(Relic.prototype),Gem.prototype.constructor=Gem,Key.prototype=Object.create(Relic.prototype),Key.prototype.constructor=Key,Heart.prototype=Object.create(Relic.prototype),Heart.prototype.constructor=Heart,Star.prototype=Object.create(Relic.prototype),Star.prototype.constructor=Star;var allEnemies=[new evilerEnemy,new evilestEnemy,new evilEnemy],player=new Player,allRelics=[new Gem("images/Gem-Blue-sm.png",100),new Gem("images/Gem-Orange-sm.png",300),new Gem("images/Gem-Green-sm.png",500),new Key,new Heart,new Star],heySound=new Audio("sounds/hey.wav"),respectSound=new Audio("sounds/respect.wav"),screwYouSound=new Audio("sounds/screwYou.wav"),sonBitchSound=new Audio("sounds/son_of_a.wav"),blueGemSound=new Audio("sounds/blueGem.wav"),greenGemSound=new Audio("sounds/greenGem.wav"),orangeGemSound=new Audio("sounds/orangeGem.wav"),heartSound=new Audio("sounds/heart.wav"),keySound=new Audio("sounds/key.wav"),transformSound=new Audio("sounds/transform.wav"),untransformSound=new Audio("sounds/transform.wav"),starBackgroundSound=new Audio("sounds/starPower.wav"),reachTopSound=new Audio("sounds/touchWater.wav"),extraLifeSound=new Audio("sounds/extraLife.wav"),gameOverSound=new Audio("sounds/gameOver.wav"),completeLevelSound=new Audio("sounds/completeLevel.wav"),pauseSound=new Audio("sounds/pause.mp3"),unPauseSound=new Audio("sounds/unPause.mp3"),spacebarClickSound=new Audio("sounds/spaceBarClick.wav"),winGameSound=new Audio("sounds/winGame.wav"),gameMusicSound=new Audio("sounds/gameMusic.mp3"),introMusicSound=new Audio("sounds/introMusic.wav");introMusicSound.play(),introMusicSound.loop=!0;