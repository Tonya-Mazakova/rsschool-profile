import {game} from "Splash.js";
import {score_Level2} from "Level_2.js";
import {scoreString, onOver, onOut, menuRun, restartRun} from "Level_1.js";
export {GameVictory};


function GameVictory(game){

}

let alien,
    menuOption,
    restartOption,
    scoreStyle,
    score_Final,
    scoreText_Final;


GameVictory.prototype = {

    preload: function(){
        this.load.spritesheet('alien', 'assets/img/alien1.png', 300, 360);
    },

    create:function(){

//  item of menu
        let optionStyle = {
            font: '40pt Arial',
            fill: '#e4e7ea',
            align: 'center',
            stroke: 'rgba(0,0,0,0)',
            srokeThickness: 4
        };
        menuOption = game.add.text(this.world.centerX, this.world.centerY-120, 'Menu', optionStyle);
        restartOption = game.add.text(this.world.centerX, this.world.centerY-60, 'Restart', optionStyle);

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

//  score
        score_Final = score_Level2;
        scoreStyle = {font: '70px Arial', fill: '#1880d0'};
        scoreText_Final = this.add.text(this.world.centerX-170, 70, scoreString + score_Final, scoreStyle);

        alien = this.add.tileSprite(this.world.centerX, this.world.centerY-25, 300, 360, 'alien');
    },


    update: function(){

    }
};