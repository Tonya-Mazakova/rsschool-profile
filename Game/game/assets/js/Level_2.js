import {game} from "Splash.js";
import {Splash} from "Splash.js";
import {Level_1} from "Level_1.js";
import {player, score, scoreText, scoreStyle,numLife, lifeString, lifeText, lifeStyle, musicGame} from "Level_1.js";
import {createPlayer, movePlayer, onOver, onOut, menuRun, restartRun} from "Level_1.js";
import {GameMenu} from "GameMenu.js";

export{score_Level2};
export {Level_2};

let Level_2 = function(game){

};

let backgroundGame,
    bossEnemy,
    score_Level2,
    scoreString_level2,
    scoreText_Level2,
    numLife_Level2,
    lifeText_Level2,
    stateText1,
    stateText2,
    stateText3,
    explosionSound,
    bulletSound,
    bullets,
    bullet,
    bulletsEnemy,
    bulletEnemy,
    randomBullets,
    fireButton,
    firingTimer = 0,
    bulletTime = 0,
    bossLife,
    bossString,
    bossStyle,
    bossText,
    menuOption,
    restartOption,
    explosions,
    explosion,
    lightning;


Level_2.prototype = {

    init:function(){

    },
    preload: function(){
        bossLife = 50;
        this.load.spritesheet('boss', 'assets/img/alien.png', 401, 306);
        this.load.image('lightning', 'assets/img/lightning1.png');
    },
    create: function(){
        explosionSound = this.add.audio('explosion');
        bulletSound = this.add.audio('bulletSound');

        this.physics.startSystem(Phaser.Physics.ARCADE);

        backgroundGame = this.add.tileSprite(0, 0, 670, 670, 'Level_2_bg');

//  music games
         musicGame.play();
         this.stage.disableVisibilityChange = true;

//  Create a boss of enemies
        bossEnemy = this.add.tileSprite(200, 170, 401, 306, 'boss');
        bossEnemy.alpha = 1;
        game.physics.arcade.enable(bossEnemy);
        bossEnemy.enableBody = true;
        bossEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        bossEnemy.anchor.setTo(0.5, 0.5);
        bossEnemy.animations.add('fly', [0,0], 20, true);
        bossEnemy.play('fly');
        let tween = game.add.tween(bossEnemy).to( { x: 470 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

//  score
        scoreString_level2 = 'Score : ';
        score_Level2 = score;
        scoreText_Level2 = this.add.text(10, 10, scoreString_level2 + score_Level2, scoreStyle);

//  life
        numLife_Level2 = numLife;
        lifeText_Level2 = this.add.text(game.width - 125, 10, lifeString + numLife_Level2, lifeStyle);

//  Boss life
        bossString = 'Boss : ';
        bossStyle = {font: '30px Arial', fill: 'red'};
        bossText = this.add.text(this.world.centerX-40, 10, bossString + bossLife, bossStyle);

//  player
        createPlayer();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

//  Text
        stateText1 = this.add.text(this.world.centerX,this.world.centerY-130,' ', { font: '84px Arial', fill: '#1880d0' });
        stateText1.anchor.setTo(0.5, 0.5);
        stateText1.visible = false;

//  Bullet group of player
        bullets = this.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1.6);

//  Bullet group of enemy
        bulletsEnemy = this.add.group();
        bulletsEnemy.enableBody = true;
        bulletsEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        bulletsEnemy.createMultiple(120, 'lightning');
        bulletsEnemy.setAll('anchor.x', -1);
        bulletsEnemy.setAll('anchor.y', 1);

//  An explosion pool
        explosions = this.add.group();
        explosions.createMultiple(400, 'explode');
        explosions.forEach(this.setupInvader, this);

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

    },

    update:function(){
        movePlayer();

//  Collisions
        this.physics.arcade.overlap(player,bossEnemy, this.collisionBossPlayer, null, this);
        this.physics.arcade.overlap(bulletsEnemy,player, this.collisionBulletBoss, null, this);
        this.physics.arcade.overlap(bullets,bossEnemy, this.collisionBulletPlayer, null, this);

//  Firing
        if (fireButton.isDown) {
            this.fireBullet();
        }

        if (game.time.now > firingTimer) {
            this.fireBulletEnemy();
        }
    },

collisionBossPlayer: function(){
        explosionSound.play();
        explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explode', 30, false, true);
        player.kill();
        numLife_Level2 -= 1;
        lifeText_Level2.text = lifeString + numLife_Level2;

        if (numLife_Level2 === 0) {
            stateText1.text = "GAME OVER";
            stateText1.visible = true;
            menuOption.visible = true;
            restartOption.visible = true;
            backgroundGame.alpha=0.3;
            bossEnemy.alpha = 0.3;
            player.alpha = 0.3;
            musicGame.stop();
            game.paused = true;
        }
        player.revive();
        player.position.x = 325;
        player.position.y = 550;
    },

    setupInvader:function(param) {
        param.anchor.x = 0.3;
        param.anchor.y = 0.5;
        param.animations.add('explode');

    },

    collisionBulletBoss: function(){
        explosionSound.play();
        explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explode', 30, false, true);
        player.kill();
        numLife_Level2 -= 1;
        lifeText_Level2.text = lifeString + numLife_Level2;

        if(numLife_Level2 === 0){
            backgroundGame.alpha=0.3;
            bossEnemy.alpha = 0.3;
            player.alpha = 0.3;
            stateText1.text = "GAME OVER";
            stateText1.visible = true;
            menuOption.visible = true;
            restartOption.visible = true;
            musicGame.stop();
            game.paused = true;
        }

        player.revive();
        player.position.x = 325;
        player.position.y = 550;
    },

    collisionBulletPlayer:function(){
        explosionSound.play();
        explosion = explosions.getFirstExists(false);
        explosion.reset(bossEnemy.body.x+200, bossEnemy.body.y+200);
        explosion.play('explode', 30, false, true);
        bossLife -= 1;
        bossText.text = bossString + bossLife;
        score_Level2 += 10;
        scoreText_Level2.text = scoreString_level2 + score_Level2;
        bullet.kill();
        if(bossLife === 0){
            musicGame.stop();
            this.state.start("GameVictory");
        }
    },

   fireBullet: function(){
        if (this.time.now > bulletTime) {
            bullet = bullets.getFirstExists(false);
            game.physics.arcade.enable(bullet);

            bulletSound.play();

            if (bullet) {
                bullet.reset(player.x, player.y + 8);
                bullet.body.velocity.y = -400;
                bulletTime = this.time.now + 200;
            }
            if (bullet.y < 0){
                bullet.kill();
            }
        }
    },
    fireBulletEnemy: function(){
        bulletEnemy = bulletsEnemy.getFirstExists(false);
        randomBullets = this.rnd.integerInRange(0, 1);
        bulletEnemy.anchor.setTo(randomBullets, 1.6);
        bulletEnemy.enableBody = true;
        bulletEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enable(bulletEnemy);
        bulletEnemy.reset(bossEnemy.body.x, bossEnemy.body.y);
        bulletEnemy.body.velocity.y = 350;
        firingTimer = game.time.now + 3000;

    }
};
