var Preload = function(game){};

Preload.prototype = {

    preload: function(){
        this.game.load.image('tile', 'assets/tile.png');
        this.game.load.image('crumbled', 'assets/crumbled.png');
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.spritesheet('campfire', 'assets/camp-fire.png', 64, 64 );
        this.game.load.spritesheet('player', 'assets/wrestler_tiled.png', 57, 68);
    },

    create: function(){
        this.game.state.start("Main");
    }
}
