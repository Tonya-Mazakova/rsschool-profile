export {GameMenu};
import {game} from "Splash.js";


let GameMenu = function(){

};

let musicMenu;

GameMenu.prototype = {

    init: function(){
        this.titleText = this.make.text(this.world.centerX, 200, "Space Shooter", {
            font: 'bold 40pt Arial',
            fill: '#e4e7ea',
            align: 'center'
           });
        this.titleText.setShadow(6, 6,'rgba(22,42,51,1)', 5);
        this.titleText.anchor.set(0.5);
       },

    preload: function(){
        this.optionCount  =  1;
       },

    addMenuOption: function(text, callback) {
        let optionStyle = { font: '30pt Arial', fill: '#e4e7ea', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
        let txt = this.add.text(this.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
        txt.anchor.set(0.5);
        this.onOver = function (target) {
            target.fill = "#1880d0";
            /*target.stroke = "rgba(200,200,200,0.5)";*/
            txt.useHandCursor = true;
        };
        this.onOut = function (target) {
            target.fill = "#e4e7ea";
            /*target.stroke = "rgba(0,0,0,0)";*/
            txt.useHandCursor = false;
        };

        txt.stroke = "rgba(0,0,0,0)";
        txt.strokeThickness = 4;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(this.onOver);
        txt.events.onInputOut.add(this.onOut);
        this.optionCount ++;
    },

    create: function() {
        this.add.existing(this.titleText);

//  item of menu
        this.addMenuOption('Start', function () {
            musicMenu.stop();
            game.state.start('Level_1');
        });
        this.addMenuOption('About', function () {
            window.open("about.html");
        });

//  music games
        musicMenu = this.add.audio('musicMenu');
        musicMenu.loop = true;
        musicMenu.play();
        this.stage.disableVisibilityChange = true;//music does not stop when switching to another tab
    }
};


