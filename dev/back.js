



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
	
		
	
			},
	
		
	
			play:function(action){
	
		
	
				//process the new game state
	
		
	
				return "false";
	
		
	
			},
	
			roomDesc: function(){
	
				//get the current description of the room
	
				return this.room.description;
	
			},
	
			roomTips: function(){
	
				//get the current description of the room
	
				var tips = this.room.tips;
	
				var rand = this.getRand(1,tips.length);
	
				return tips[rand];
	
	
	
			},
	
			roomNav: function(dir){
	
				var newRoom = "";
	
			   switch(dir){
	
				   case "east" : newRoom = this.room.navigation.east.nextroom;break;
	
				   case "west" : newRoom = this.room.navigation.west.nextroom;break;
	
				   case "north" : newRoom = this.room.navigation.north.nextroom;break;
	
				   case "south" : newRoom = this.room.navigation.south.nextroom;break;
	
			   }
	
				if(newRoom==""){
	
					return "not an option";
	
				}else{
	
					return this.moveRoom(newRoom);
	
				}
	
			},
	
			restart:function(){
	
		
	
				this.start();      
	
		
	
			},
	
			getData : function(filename,id){
	
				//read the rooms.json list of room objects
	
				var m ="";
	
				var fs = require('fs');
	
			var m = JSON.parse(fs.readFileSync(this.path + filename,'utf8'));
			
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
	
	
	
				//look at the on enter condition
	
				if(room.enter.condition.stat == "fight"){
	
				var monsters = ['monster2.wav','slimer.wav'];
	
					var rand =  this.getRand(0,1);
	
				 return this.fightMonster(room) + "@"+ monsters[rand] ;
	
		
	
				}
	
		   
	
				if(room.enter.condition.stat == "holding"){
	
				  return  this.activateItem(room);
	
				}
	
		
	
				this.room =room;
	
				return this.roomDesc();
	
	
	
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