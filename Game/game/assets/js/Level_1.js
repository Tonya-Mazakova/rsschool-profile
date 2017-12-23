import {game} from "Splash.js";
export {Level_1};
export {score, scoreString, scoreText, scoreStyle, numLife, lifeString, lifeText,lifeStyle, musicGame};
export {player};


export function createPlayer(){
    player = game.add.sprite(325, 550, 'player');
    player.alpha = 1;
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
}

export function movePlayer(){
    cursors = game.input.keyboard.createCursorKeys();

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -130;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 130;
    }
    else if (cursors.up.isDown) {
        player.body.velocity.y = -100;
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 60;
    }

}

export function onOver(target){
    target.fill = "#1880d0";
    target.stroke = "rgba(200,200,200,0.5)";
    target.useHandCursor = true;
}

export function onOut(target){
    target.fill = "#e4e7ea";
    target.stroke = "rgba(0,0,0,0)";
    target.useHandCursor = false;
}

export function menuRun(){
    game.paused = false;
    musicGame.stop();
    game.state.start('Splash');
}

export function restartRun(){
    game.paused = false;
    musicGame.stop();
    game.state.start('Level_1');
}

let backgroundGame,
    player,
    enemyShip,
    enemyShips,
    wrapMeteors,
    wrapCreateMeteors,
    wrapRangeMeteors,
    timerMeteors,
    cursors,
    fireButton,
    meteor,
    meteors,
    random,
    randomMeteor,
    rnd_x,
    rnd_y,
    scoreString,
    scoreText,
    scoreStyle,
    explosions,
    explosion,
    explosionSound,
    bulletSound,
    bullets,
    bullet,
    bulletsEnemy,
    bulletEnemy,
    coin,
    coins,
    coinSound,
    firingTimer = 0,
    bulletTime = 0,
    score,
    numLife,
    lifeString,
    lifeText,
    lifeStyle,
    musicGame,
    stateText1,
    menuOption,
    restartOption,
    timer,
    timerEvent,
    text;



var Level_1 = function(game){

};

Level_1.prototype= {

//PRELOAD
     preload:function() {
        score = 0;
        numLife = 5;
    },

//  CREATE
    create:function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        backgroundGame = this.add.tileSprite(0, 0, game.width, game.height, 'Level_1_bg');
        explosionSound = this.add.audio('explosion');
        bulletSound = this.add.audio('bulletSound');
        coinSound = this.add.audio('coinSound');

//  timer
        timer = game.time.create();

        // Create a delayed event 1m and 30s from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 0, this.endTimer, this);

        // Start the timer
        timer.start();

//  music games
        musicGame = this.add.audio('musicGame');
        musicGame.loop = true;
        musicGame.play();
        this.stage.disableVisibilityChange = true;

//  player coordinates on the field

        createPlayer();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

//  Creation of group for enemy ships
        enemyShips = this.add.group();
        this.physics.enable(enemyShips, Phaser.Physics.ARCADE);
        this.createShips(enemyShip, 10, 10);


//  Create meteor
        meteors = this.add.group();
        meteors.enableBody = true;
        meteors.physicsBodyType = Phaser.Physics.ARCADE;
        meteors.createMultiple(10, 'meteor');
        meteors.setAll('anchor.x', 0.5);
        meteors.setAll('anchor.y', 0.5);

        wrapCreateMeteors = this.createMeteors.bind(this);
        wrapRangeMeteors = this.rangeMeteors.bind(this);

        wrapRangeMeteors(wrapCreateMeteors, meteors);


//  The score
        scoreString = 'Score : ';
        scoreStyle = {font: '30px Arial', fill: '#fff'};
        scoreText = this.add.text(10, 10, scoreString + score, scoreStyle);

//  The lifes
        lifeString = 'Life : ';
        lifeStyle = {font: '30px Arial',fill: '#fff'};
        lifeText = this.add.text(game.width - 120, 10, lifeString + numLife, lifeStyle);

//  Bullet group of player
         bullets = this.add.group();
         bullets.enableBody = true;
         bullets.physicsBodyType = Phaser.Physics.ARCADE;
         bullets.createMultiple(30, 'bullet');
         bullets.setAll('anchor.x', 0.5);
         bullets.setAll('anchor.y', 1.6);
         bullet = bullets.getFirstExists(false);
//  Bullet group of enemy
         bulletsEnemy = this.add.group();
         bulletsEnemy.enableBody = true;
         bulletsEnemy.physicsBodyType = Phaser.Physics.ARCADE;
         bulletsEnemy.createMultiple(120, 'bulletEnemy');
         bulletsEnemy.setAll('anchor.x', -3);
         bulletsEnemy.setAll('anchor.y', -1.6);

//  Create group of star
        coins = this.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        coins.createMultiple(30, 'star');
        coins.forEach(this.createCoins,this);

//  Text
        stateText1 = this.add.text(this.world.centerX,this.world.centerY-130,' ', { font: '84px Arial', fill: '#1880d0' });
        stateText1.anchor.setTo(0.5, 0.5);
        stateText1.visible = false;

//  item of menu
        let optionStyle = {
            font: '40pt Arial',
            fill: '#e4e7ea',
            align: 'center',
            stroke: 'rgba(0,0,0,0)',
            srokeThickness: 4
        };
        menuOption = game.add.text(this.world.centerX, this.world.centerY, 'Menu', optionStyle);
        restartOption = game.add.text(this.world.centerX, this.world.centerY + 80, 'Restart', optionStyle);

        menuOption.visible = false;
        restartOption.visible = false;

        menuOption.inputEnabled = true;
        restartOption.inputEnabled = true;

        menuOption.anchor.set(0.5);
        restartOption.anchor.set(0.5);

        menuOption.events.onInputOver.add(onOver);
        menuOption.events.onInputOut.add(onOut);

        restartOption.events.onInputOver.add(onOver);
        restartOption.events.onInputOut.add(onOut);

        menuOption.events.onInputUp.add(menuRun);
        restartOption.events.onInputUp.add(restartRun);

//  An explosion pool
        explosions = this.add.group();
        explosions.createMultiple(30, 'explode');
        explosions.forEach(this.setupInvader, this);
    },

//this function is executed several times per second
//  UPDATE
     update:function() {

        meteors.angle+=.4;

//  Collisions
        this.physics.arcade.overlap(player, enemyShips, this.collisionShips, null, this);
        this.physics.arcade.overlap(bullets, enemyShips, this.collisionHandler, null, this);
        this.physics.arcade.overlap(player, bulletsEnemy, this.collisionShips, null, this);
        this.physics.arcade.overlap(meteor, player, this.collisionMeteor, null, this);
        this.physics.arcade.overlap(player, coins, this.takeCoin, null, this);

        if (bullet.body.velocity.y === 0){
             bullet.kill();
         }

//  Random placement of ships after moving to the end of the field
        enemyShips.forEach(function (item, i, enemyShips) {
            if (item.y > 670) {
                rnd_x = game.rnd.integerInRange(20, 650);
                rnd_y = game.rnd.integerInRange(0, -670);
                item.x = rnd_x;
                item.y = rnd_y;
                item.anchor.setTo(0.5, 0.5);
                item.body.gravity.y = 0;
            }
        });

//  Player movement
         movePlayer();

//  Firing
         if (fireButton.isDown) {
             this.fireBullet();
             if(bullet.y < 0) {
                 bullet.kill();
             }
         }

         if (game.time.now > firingTimer) {
             this.fireBulletEnemy();
         }
    },

  render:function(){
       if (timer.running) {
           game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 335, 25, "#ff0");
       }
       else {
           game.debug.text("Next Level!", 335, 25, "#0f0");
           clearTimeout(timerMeteors);
           backgroundGame.alpha=0.3;
           musicGame.stop();
           let textLevel = this.add.text(this.world.centerX, this.world.centerY, "Level 2", { font: '60pt Arial',weight:'bold', fill: '#1880d0',opacity:'0', transition: "opacity 2s ease-in-out"});
           textLevel.anchor.setTo(0.5, 0.5);
           this.nextLevel(game,'Level_2');
       }
   },
        endTimer: function() {
// Stop the timer when the delayed event triggers
        timer.stop();
    },
        formatTime: function(s) {
// Convert seconds (s) to a nicely formatted and padded time string
        let minutes = "0" + Math.floor(s / 60);

        let seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    },

   collisionShips:function(player, enemy) {
        explosionSound.play();
        explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explode', 30, false, true);
        enemy.kill();

        numLife -= 1;
        lifeText.text = lifeString + numLife;

        if (numLife === 0) {
            clearTimeout(timerMeteors);
            stateText1.text = "GAME OVER";
            stateText1.visible = true;
            menuOption.visible = true;
            restartOption.visible = true;
            backgroundGame.alpha=0.3;
            musicGame.stop();
            game.paused = true;
            this.input.onTap.addOnce(this.restart, this);
        }
        this.createShips(enemyShip,1,0);
    },

    collisionHandler: function(bullet, enemyShip) {
        explosion = explosions.getFirstExists(false);
        explosion.reset(enemyShip.body.x, enemyShip.body.y);
        explosion.play('explode', 30, false, true);

        coin = coins.getFirstExists(false);
        coin.reset(enemyShip.body.x, enemyShip.body.y);
        coin.play('star', 10, true);

        bullet.kill();
        enemyShip.kill();

        explosionSound.play();
//  Increase the score
        score += 10;
        scoreText.text = scoreString + score;

        this.createShips(enemyShip,1,10);
    },

    nextLevel: function(context, level){
        musicGame.stop();
        setTimeout(function(){
            context.state.start(level, true, false);
        },2000)
},
    collisionMeteor: function(meteor, player){
        explosionSound.play();
        explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explode', 30, false, true);

        player.kill();
        numLife -= 1;
        lifeText.text = lifeString + numLife;

        if (numLife === 0) {
            clearTimeout(timerMeteors);
            stateText1.text = "GAME OVER";
            stateText1.visible = true;
            menuOption.visible = true;
            restartOption.visible = true;
            backgroundGame.alpha = 0.3;
            musicGame.stop();
            game.paused = true;
        }
        player.revive();
        player.position.x = 325;
        player.position.y = 550;
    },

    fireBullet: function(){
        if (this.time.now > bulletTime) {

            bullet = bullets.getFirstExists(false);
            bullet.body.collideWorldBounds = true;

            bulletSound.play();

        if (bullet) {
//  fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;

            bulletTime = this.time.now + 200;

          }
        if (bullet.body.velocity.y === 0){
                bullet.kill();
            }
        }
    },

    fireBulletEnemy: function(){
        bulletEnemy = bulletsEnemy.getFirstExists(false);

        random = this.rnd.integerInRange(0, enemyShips.children.length - 1);
        let shooter = enemyShips.children[random];

        if (shooter.x > 0 & shooter.y > 0 & shooter.alive === true) {
            bulletEnemy.reset(shooter.body.x, shooter.body.y);
            bulletEnemy.body.velocity.y = 400;
            firingTimer = game.time.now + 750;
        }
    },

    createShips:function(enemyShip, num, gr) {
       for (var i = 0; i < num; i++) {

            rnd_x = this.rnd.integerInRange(20, 650);
            rnd_y = this.rnd.integerInRange(0, -670);

            enemyShip = enemyShips.create(rnd_x, rnd_y, 'shipEnemy');
            enemyShip.anchor.setTo(0.5, 0.5);
            this.physics.enable(enemyShip, Phaser.Physics.ARCADE);
            enemyShip.body.gravity.y = gr;
            enemyShip.revive();
        }
    },

    createMeteors:function(meteors) {
        meteor = meteors.getFirstExists(false);
        meteor.reset(meteor.body.x, meteor.body.y);
        this.physics.arcade.moveToObject(meteor,player,120);
    },

    rangeMeteors:function(func,x){
        func(x);
        timerMeteors = setTimeout(function(){
          wrapRangeMeteors(func,x);
    }, 13000);
},

    createCoins: function(param){
        param.anchor.setTo(0.5, 0.5);
        param.animations.add('star');
    },

    takeCoin:function(player,coins){
        coinSound.play();
        coins.kill();
        score+=20;
        scoreText.text = scoreString + score;
    },

    toKillCoin: function(){
        setTimeout(function(){
            coin.kill();
        },5000);
    },

    setupInvader:function(param) {
        param.anchor.x = 0.3;
        param.anchor.y = 0.5;
        param.animations.add('explode');

    },

    restart:function() {
        game.paused = false;
        player.kill();
        enemyShips.removeAll();
        backgroundGame.alpha=1;
        musicGame.play();
        wrapRangeMeteors(wrapCreateMeteors, meteors);
        numLife = 5;
        lifeText.text = lifeString + numLife;
        score = 0;
        scoreText.text = scoreString + score;
        this.createShips(enemyShip, 10, 10);
        this.createMeteors(meteors);

//revives the player
        player.revive();
        player.position.x =325;
        player.position.y =550;

//hides the text
        stateText1.visible = false;

    }
};