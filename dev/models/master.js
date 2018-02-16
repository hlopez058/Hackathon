
var DM = {
    init: function(){
        //setup the chat bot, and 
        //speaking voice for the
        //DM 
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
    foundItem: function(item){
        var msg = "You have found "        
        if(this.startWithVowel(item)){
            msg+="an ";
        }else{
            msg+="a ";
        }
        msg+=item;
        return msg;
    },
    describeItem: function(item){
        var msg = "This is ";
        msg += item.description

        if(item.attack>0 && item.defense>0){
            msg+= ". It can increase attack by " + item.attack + " and increase defense by " + item.defense;
        }else{
            if(item.attack>0){
                msg+= ". It can increase attack by " + item.attack;     
            }
            if(item.defense>0){
                msg+= ". It can increase defense by " + item.defense;     
            }
            if(item.attack==0 && item.defense==0){
                msg+= "It has no attack or defense bonus.";
            }
        }

        if(item.gold>0){
         msg += "It can be sold for " + item.gold + " gold pieces";
        }
        return msg;
    }
    
}
