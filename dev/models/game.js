var Game = {
    room : null,
    player: null,
    running:false,
    create: function(){
        var obj = Object.create(this);
        obj.running = true;        
        return obj;
    }
}

module.exports = Game;
