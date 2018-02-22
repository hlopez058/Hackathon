

var GameEngine = {
    
        game:null,  
    
        player:null,  
    
        path:null,

        room :null,
    
        create: function(path){
    
            var obj = Object.create(this);
    
            obj.path = path;
            obj.room = null;
            obj.game = require('./models/game').create();        
    
            obj.player = require('./models/player').create();        
    
            return obj;
    
        },
    
        start:function(){
    
            this.game = require('./models/game').create();
    
            this.player=require('./models/player').create();
            
            this.room = this.getRoom("1");
            
            console.log("room initialized");
            console.log(JSON.stringify(this.room));
        },
    
        play:function(action){
    
            //process the new game state
    
            return "false";
    
        },
        roomDesc: function(view){
            //get the current description of the room
            if(view=="room"){
                return this.room.description;                
            }
            else{
            
                var newRoom = "";
                switch(view){
                    case "east" : newRoom = this.room.navigation.east.desc;break;
                    case "west" : newRoom = this.room.navigation.west.desc;break;
                    case "north" : newRoom = this.room.navigation.north.desc;break;
                    case "south" : newRoom = this.room.navigation.south.desc;break;
                }
            return newRoom;
            }
        },
        roomTips: function(){
            //get the current description of the room
            var tips = this.room.tips;
            var rand = this.getRand(1,tips.length);
            return tips[rand];

        },
        roomNav: function(dir){
            var next = "";
            
            console.log("Undefined room!" + JSON.stringify(this.room));
        
            switch(dir){
               case "east" :return this.moveRoom(this.room.navigation.east.nextroom);break;
               case "west" : return this.moveRoom(this.room.navigation.west.nextroom);break;
               case "north" :return this.moveRoom(this.room.navigation.north.nextroom);break;
               case "south" :return this.moveRoom(this.room.navigation.south.nextroom);break;
           }

           var newRoomd="";
           if(next=""){
                switch(dir){
                    case "east" : newRoomd = this.room.navigation.east.desc;break;
                    case "west" : newRoomd = this.room.navigation.west.desc;break;
                    case "north" : newRoomd = this.room.navigation.north.desc;break;
                    case "south" : newRoomd = this.room.navigation.south.desc;break;
                    default:newRoomd="";
                }
                return newRoomd;
            }else{
                console.log("returning a read value : "+ next);
                return this.moveRoom(next);                
            }
        },
        restart:function(){
    
            this.start();      
    
        },
        getData : function(filename,id){
            //read the rooms.json list of room objects
            var m ="";
            var fs = require('fs');
            var m = JSON.parse(fs.readFileSync(this.path + filename, 'utf8'));
            console.log(m[id]);
            return m[id];
        },
        getRoom : function(id){
           return this.getData('rooms.json',id);
    
        },
        getRand: function randomIntFromInterval(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        },
        getMonster : function(id){
    
            return this.getData('monsters.json',id);
    
         },
    
         updatePlayer: function (stat,value){
    
            switch(stat){
    
                case "level" : 
    
                    this.player.level = this.player.level + value;
    
                break;
    
                case "health" : 
    
                    this.player.health = this.player.health + value;
    
                break;
    
                case "gold" : 
    
                    this.player.addGold(value);
    
                break;
    
                case "death" : 
    
                    this.player.death = value;
    
                break;
    
            }
    
         },
        moveRoom: function(id){

            console.log("**id-"+id);
            var room = this.getRoom(id);
            //conditions to enter the room

            this.room = room;


            if(room.enter.condition.stat == "pickup"){
                                    
                return this.roomDesc("room");
            }

            if(room.enter.condition.stat == "die"){
                this.room = this.getRoom("1");
                this.player.items = [];
                return room.enter.condition.true.desc;
            }

            //look at the on enter condition
            if(room.enter.condition.stat == "fight"){
                return this.fightMonster(room);
            }
       
            if(room.enter.condition.stat == "holding"){
              return  this.activateItem(room);
            }
    
            
            return this.roomDesc("room");

        },
        
        activateItem: function(room){
    
            var item = room.enter.condition.value;
    
            
    
            //TODO :
    
            // create a seach for holding items to 
    
            //see if that is usable for activating the 
    
            //room if it is not render the true and false. 
    
            //conditions 
    
    
    
            var stat = room.enter.condition.true.stat;
    
            var val = room.enter.condition.true.value;
    
            var desc = room.enter.condition.true.desc;
    
        
    
        },
    
        fightMonster: function(room){
    
            //look up the monster from the value 
    
            var monsterName = room.enter.condition.value;
    
            var monster = this.getMonster(monsterName);
    
            var damage = monster.attack - this.player.defense;
    
            this.player.takeDamage(damage); 
    
            var successful= "";
    
            if(!this.player.dead)
    
            {
    
                if(this.player.attack > monster.defense ){
    
                    successful= true;
    
                }else{
    
                    successful=false;
    
                }
    
            }
    
            else
    
            {
    
                successful=false;
    
            }
    
            
    
            if(successful){
    
                var stat = room.enter.condition.true.stat;
    
                var val = room.enter.condition.true.value;
    
                var desc = room.enter.condition.true.desc;
    
                this.updatePlayer(stat,val);
    
                return desc;
    
            }else{
    
                var stat = room.enter.condition.false.stat;
    
                var val = room.enter.condition.false.value;
    
                var desc = room.enter.condition.false.desc;
    
                this.updatePlayer(stat,val);
    
                return desc;
    
            }
    
            
    
        },
    
    }
    
    
    
    module.exports = GameEngine;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    
    //Load Game Script
    
    //Move this to GameMgr.js
    
    //
    
    var fs = require('fs');
    
    var script = JSON.parse(fs.readFileSync(__dirname+"\\data\\script.json",'utf8'));
    
    
    
    var Iplayer = require('./models/player');
    
    
    
    var player = Iplayer.create("bob");
    
    
    
    //------------------------------
    
    // Game Engine Processor
    
    //------------------------------
    
    // Entry point for decision trees
    
    var processor = function(data){
    
        //Use chatbot to process inputs
    
        //get resut of chat bot to run functions
    
        // var response = ChatBot(data)    
    
        if(script[data]==undefined){
    
            console.log("I do not understand that yet.");
    
        }else{
    
            console.log(script[data]);
    
        }
    
    }
    
    
    
    ///------------------------------>
    
    // Interface- Console Demo
    
    // (Replace with real Interfaces)
    
    ///------------------------------>
    
    var readline = require('readline'),
    
    rl = readline.createInterface(process.stdin, process.stdout);
    
    rl.setPrompt('>> ');
    
    rl.prompt();
    
    rl.on('line', function(line) {
    
    switch(line.trim()) {
    
        case 'hello':
    
            console.log('hello lets play');
    
            break;
    
        default:
    
            processor(line);
    
        break;
    
    }
    
    rl.prompt();
    
    }).on('close', function() {
    
    console.log('Have a great day!');
    
    process.exit(0);
    
    });
    
    ///------------------------------>
    
    */