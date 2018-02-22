var GameMgr =  {
    path:null,
    newGameReq:false,
    engine:null,
    create: function(path){
        var obj = Object.create(this);
        //create a gamestate object
        obj.path =  path ;
        var GameEngine = require('./tjbot.GameEng');
        obj.engine = GameEngine.create(path);
        return obj;
    },
    parse:function(data){
        //----------------------------------------------
        // Game Manager Intterrupts
        //----------------------------------------------
        if(this.newGameReq){
           if(data.toString().toLowerCase().includes('yes')){
               this.newGame();
            }else{
               this.newGameReq = false; 
            }
            return;
        }
        if(data.toString().toLowerCase().includes('new game')){
            this.newGame();
            return;
        }
        if(data.toString().toLowerCase().includes('pause game')||
        data.toString().toLowerCase().includes('save game')){
            this.pauseGame();
            return;
        }
        if(data.toString().toLowerCase().includes('restart game')){
            this.restartGame();
            return;
        }
        if(data.toString().toLowerCase().includes('load game')||
            data.toString().toLowerCase().includes('resume game')){
            this.loadGame();
            return;
        }
        if(data.toString().toLowerCase().includes('quit game')){
            this.quitGame();
            return;
        }
        //----------------------------------------------

        //----------------------------------------------
        // Game Engine Processing input data
        //----------------------------------------------

        if(this.engine.running)
        {
            var played = this.engine.play(action);
            return played;
        }else{
            return "game is not running.";
        }

        //----------------------------------------------
    },
    newGame: function(){
        if(this.engine.game.running && this.newGameReq==false){
            this.newGameReq = true;
            return "Are you sure you would like to start a new game?";
        }

        this.engine.start();
        this.newGameReq = false; 
        return "Starting a new game.";  
        
    },
    pauseGame: function(){
        this.saveGame();
        return "The game has been paused.";
    },
    restartGame: function(){
        this.newGame();
    },
    loadGame: function(){
        var fs = require('fs');
        fs.readFile(this.path + 'gamedata.json', 'utf8', 
        function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            this.engine.game = obj;
        }});
        return  "Game loaded.";
    },
    quitGame: function(){
        this.engine.game.running = false;
        return "The game has ended.";
    },
    saveGame: function(){
        var gamedata = JSON.stringify(this.engine.game);
        var fs = require('fs');
        fs.writeFile(this.path + 'gamedata.json', gamedata, 'utf8', function(data){
           if(data!=null){ console.log(data)};
        });
        return "Game saved";
    }
}

module.exports = GameMgr;
