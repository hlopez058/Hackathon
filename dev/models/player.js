
//Player Object
var player = {
    "name":null,
    "level":1,
    "gold":0,
    "health":100,
    "attack":10*level,
    "defense":.10*health,
    "maxItems":3,
    "items" :[],
    "holding" : "nothing",
    "dead":false,
    create:function(name){
        var obj = Object.create(this);
        obj.name = name;
        return obj;
    },
    startWithVowel: function(item){
        if(item.startsWith("a") || 
        item.startsWith("e")||
        item.startsWith("u")||
        item.startsWith("i")||
        item.startsWith("o"))
        {
            return true;
        }
    },
    pickup: function(item){
        if(this.items[item]!=undefined){
            return "You already have this item.";
        }else{
            if(this.items.length >= this.maxItems){
                return "You're pockets are full! Drop an item.";
            }
            this.holding = item;
            this.items.push(item);      
            if(this.startWithVowel){          
                return "You are now holding an " + item;
            }else{
                return "You are now holding a " + item;
            }
        }
    },
    use: function(item){
        if(this.items[item]!=undefined){
            if(this.holding!=item){
                this.holding=item;
                return "Switched to " + item;
            }
        }else
        {
            return "You don't have, " +item ;
        }
    },
    drop: function(item){
        if(this.items[item]!=undefined){
           this.items.pop(item);
           return "You have dropped the "+item;
        }else
        {
            return "You don't have, " +item ;
        }
    },
    buy: function(item){
      if(item.gold=0){
          return "This item is free.";
      }
        if(this.gold >= item.gold){
            this.gold - item.gold;
            this.items.push(item);
            return "You have bought the, " + item;
        }else{
            return "You don't have enough money.";
        }
    },
    addGold: function(gold){
        this.gold += gold;
        return "You now have "+ gold +" gold pieces"; 
    },
    subtractGold: function(gold){
        this.gold -= gold;
        if(this.gold<0){
            this.gold=0;
        }
        return "You now have "+ gold +" gold pieces";
    },
    block: function(damage){
        var def = this.defense + this.holding.defense;
        if(damage>def){
            this.health -= (damage - def);
        
            if(this.health <= 0 ){
                this.die();
                return "You have been killed!";
            }

            if(this.health < 10){
                return "You are in danger!";
            }    
            return "You took some damage";
        }
    },
    die : function(){
        this.dead = true;
    },
    inventory: function(){
        //query items
        var msg="You have the following items; ";
        for(var i in this.items){
            msg += i + " , ";
        }
        msg+= " and you are currently holding ," + this.holding;
    }
}

module.exports = player;