var Main = function(game){

};

Main.prototype = {
    create: function() {
        var me = this;

        //The spacing for the initial platforms
        me.spacing = 300;

        //Set the initial score
        me.score = 0;

        //Get the dimensions of the tile we are using
        me.tileWidth = me.game.cache.getImage('tile').width;
        me.tileHeight = me.game.cache.getImage('tile').height;

        //Set the background colour to blue
        me.game.stage.backgroundColor = '479cde';

        //Enable the Arcade physics system
        me.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Add a platforms group to hold all of our tiles, and create a bunch of them
        me.platforms = me.game.add.group();
        me.platforms.enableBody = true;
        me.platforms.createMultiple(250, 'tile');

        // Add [x] number of crumbled tiles.
        me.crumbled = me.game.add.group();
        me.crumbled.enableBody = true;
        me.crumbled.createMultiple(6, 'crumbled');

        //Create the inital on screen platforms
        me.initPlatforms();

        //Add the player to the screen
        me.createPlayer();

        //Create the score label
        me.createScore();

        //Add a platform every 2 seconds
        me.timer = game.time.events.loop(2000, me.addPlatform, me);

        //Enable cursor keys so we can create some controls
        me.cursors = me.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        var me = this;

        // Make the player stand still when no key is pressed.
        me.player.body.velocity.x = 0;

        //Make the sprite collide with the ground layer
        me.game.physics.arcade.collide(me.player, me.platforms);

        // Check if the player is touching a crumbled tile.
        me.game.physics.arcade.collide(me.player, me.crumbled, me.removeCrumbled, null, this);

        if (me.cursors.up.isDown && me.player.body.wasTouching.down) {
            //Make the sprite jump when the up key is pushed
             me.player.body.velocity.y = -1400;
        } else if (me.cursors.left.isDown) {
            //Make the player go left
            me.player.body.velocity.x += -500;
        } else if (me.cursors.right.isDown) {
            //Make the player go right
            me.player.body.velocity.x += 500;
        }

        //Check if the player is touching the bottom
        if(me.player.body.position.y >= me.game.world.height - me.player.body.height){
            me.gameOver();
        }
    },

    removeCrumbled: function(player, crumbled) {
        var me = this;

        // Only remove when Player touches from below.
        if (me.player.body.touching.up) {
            crumbled.kill();
        }
    },

    gameOver: function(){
        this.game.state.start('Main');
    },

    addTile: function(x, y) {
        var me = this;
        var tileVelocity = 150;

        //Get a tile that is not currently on screen
        var tile = me.platforms.getFirstDead();

        var crumbled = me.crumbled.getFirstDead();
        var crumbledChance = game.rnd.integerInRange(1, 10);

        if ( crumbled && crumbledChance > 8 ) {
            //console.log(crumbled);
            crumbled.reset(x, y);
            crumbled.body.velocity.y = tileVelocity;
            crumbled.body.immovable = true;

            //When the crumbled leaves the screen, kill it
            crumbled.checkWorldBounds = true;
            crumbled.outOfBoundsKill = true;
        } else {
    //console.log(crumbledChance);
            //Reset it to the specified coordinates
            tile.reset(x, y);
            tile.body.velocity.y = tileVelocity;
            tile.body.immovable = true;

            //When the tile leaves the screen, kill it
            tile.checkWorldBounds = true;
            tile.outOfBoundsKill = true;
        }
    },

    addPlatform: function(y){
        var me = this;

        //If no y position is supplied, render it just outside of the screen
        if(typeof(y) == "undefined"){
            y = -me.tileHeight;
            //Increase the players score
            me.incrementScore();
        }

        //Work out how many tiles we need to fit across the whole screen
        var tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);

        //Add a hole randomly somewhere
        var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

        //Keep creating tiles next to each other until we have an entire row
        //Don't add tiles where the random hole is
        for (var i = 0; i < tilesNeeded; i++) {
            if (i != hole && i != hole + 1){
                this.addTile(i * me.tileWidth, y);
            }
        }
    },

    initPlatforms: function(){
        var me = this,
            bottom = me.game.world.height - me.tileHeight,
            top = me.tileHeight;

        //Keep creating platforms until they reach (near) the top of the screen
        for(var y = bottom; y > top - ( 20 * me.tileHeight); y = y - me.spacing){
            me.addPlatform(y);
        }
    },

    createPlayer: function(){
        var me = this;

        //Add the player to the game by creating a new sprite
        me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.height - (me.spacing * 2 + (3 * me.tileHeight)), 'player');
        //Set the players anchor point to be in the middle horizontally
        me.player.anchor.setTo(0.5, 1.0);
        //Enable physics on the player
        me.game.physics.enable(me.player, Phaser.Physics.ARCADE);
        //Make the player fall by applying gravity
        me.player.body.gravity.y = 3000;
        //Make the player collide with the game boundaries
        me.player.body.collideWorldBounds = true;
        //Make the player bounce a little
        //me.player.body.bounce.y = 0.1;
    },

    createScore: function(){
        var me = this;
        var scoreFont = "100px Arial";

        me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
        me.scoreLabel.anchor.setTo(0.5, 0.5);
        me.scoreLabel.align = 'center';

        /*me.debugLabel = me.game.add.text(me.game.world.centerX, 275, '---', {font: scoreFont, fill:'#fff'});
        me.debugLabel.anchor.setTo(0.5, 0.5);

        me.debugLabel1 = me.game.add.text(me.game.world.centerX, 575, '---', {font: scoreFont, fill:'#fff'});
        me.debugLabel1.anchor.setTo(0.5, 0.5);*/
    },

    incrementScore: function(){
        var me = this;

        me.score += 1;
        me.scoreLabel.text = me.score;
    },

};
