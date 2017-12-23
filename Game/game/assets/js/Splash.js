global.PIXI = require('pixi.min');
global.p2 = require('p2.min');
global.Phaser = require('phaser.min');


import {GameMenu} from "GameMenu.js";
import {Level_1} from "Level_1.js";
import {Level_2} from "Level_2.js";
import {GameVictory} from "GameVictory.js";

//init Phaser
let game = new Phaser.Game(670, 670, Phaser.AUTO, 'game');

export {game};
export{Splash};

//  initializing Phaser
function Splash(){

}

Splash.prototype = {

//  loading game resources before starting the game
    preload: function() {
        this.load.image('player', 'assets/img/player_green.png');
        this.load.image('bullet', 'assets/img/laserGreen.png');
        this.load.image('bulletEnemy', 'assets/img/laserRed.png');
        this.load.image('Level_1_bg', 'assets/img/Level_1_bg.png');
        this.load.image('Level_2_bg', 'assets/img/Level_2_bg.png');
        this.load.image('meteor', 'assets/img/meteorBrown.png');
        this.load.image('shipEnemy', 'assets/img/enemy_black.png');
        this.load.spritesheet('explode', 'assets/img/explode.png', 128, 128, 16);
        this.load.spritesheet('star', 'assets/img/star_coin.png', 32, 32,6);
        this.load.audio('bulletSound', 'assets/bgm/bullet_sound.wav');
        this.load.audio('musicMenu', 'assets/bgm/menu_space.mp3');
        this.load.audio('musicGame', 'assets/bgm/game_space.ogg');
        this.load.audio('explosion', 'assets/bgm/explosion1.mp3');
        this.load.audio('coinSound', 'assets/bgm/coin.wav');

    },

//  is executed once after all resources have been downloaded

    addGameStates: function () {
        game.state.add("GameMenu",GameMenu);
        game.state.add("Level_1",Level_1);
        game.state.add("Level_2",Level_2);
        game.state.add("GameVictory",GameVictory);
    },

    create: function() {
        this.addGameStates();
        this.state.start('GameMenu');
    }
};

game.state.add('Splash', Splash);
game.state.start('Splash');



