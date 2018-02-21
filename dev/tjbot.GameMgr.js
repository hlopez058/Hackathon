var GameMgr =  {
    talk:null,
    path:null,
    newGameReq:false,
    chatbot:false,
    engine:null,
    create: function(path,talkback,chatbot){
        var obj = Object.create(this);
        //create a gamestate object
        obj.talk = talkback;
        obj.path =  path ;
        obj.chatbot = chatbot;
        var GameEngine = require('./tjbot.GameEng');
        obj.engine = GameEngine.create(path,talkback);
        return obj;
    },
    parse:function(data){
        //does the data have a 
        console.log("parsing:" + data);
        //----------------------------------------------
        // Game Manager Intterrupts
        //----------------------------------------------
        if(this.newGameReq){
           if(data.toLowerCase().includes('yes')){
               this.newGame();
            }else{
               this.newGameReq = false; 
            }
            return;
        }
        if(data.toLowerCase().includes('new game')){
            this.newGame();
            return;
        }
        if(data.toLowerCase().includes('pause game')||
        data.toLowerCase().includes('save game')){
            this.pauseGame();
            return;
        }
        if(data.toLowerCase().includes('restart game')){
            this.restartGame();
            return;
        }
        if(data.toLowerCase().includes('load game')||
            data.toLowerCase().includes('resume game')){
            this.loadGame();
            return;
        }
        if(data.toLowerCase().includes('quit game')){
            this.quitGame();
            return;
        }
        //----------------------------------------------

        //----------------------------------------------
        // Game Engine Processing input data
        //----------------------------------------------
        if(this.engine.game.running){
            var action = "";
            //have a chatbot do the nlp
            this.nlp.write(data,function(resp){
                action = resp;
            })
            var played = this.engine.play(action);
            //Let Chatbot handle any other statements
            //todo: make chatbot handle unknown calls
            //and interrupts like volume, rules, 
            //tips on the game etc.. 
            if(!played){
                this.chatbot.write(data,this.talk);
            }
        }else{
            //let the chatbot handle any intentions
            //for starting the game
            this.chatbot.write(data,this.talk);
        }
        //----------------------------------------------
    },
    newGame: function(){
        if(this.engine.game.running && this.newGameReq==false){
            this.talk("Are you sure you would like to start a new game?");
            this.newGameReq = true;
            return;
        }

        this.talk("Starting a new game.");  
        this.engine.start();
        this.newGameReq = false; 
    },
    pauseGame: function(){
        this.saveGame();
        this.talk("The game has been paused.");
    },
    restartGame: function(){
        this.newGame();
        this.talk("Restarting the game.");
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
    },
    quitGame: function(){
        this.engine.game.running = false;
        this.talk("The game has ended.");
    },
    saveGame: function(){
        var gamedata = JSON.stringify(this.engine.game);
        var fs = require('fs');
        fs.writeFile(this.path + 'gamedata.json', gamedata, 'utf8', function(data){
           if(data!=null){ console.log(data)};
        });
    }
}

module.exports = GameMgr;
