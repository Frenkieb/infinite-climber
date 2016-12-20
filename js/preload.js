var Preload = function(game){};

Preload.prototype = {

    preload: function(){
        this.game.load.image('tile', 'assets/tile.png');
        this.game.load.image('crumbled', 'assets/crumbled.png');
        this.game.load.image('player', 'assets/wrestler.png');
    },

    create: function(){
        this.game.state.start("Main");
    }
}
