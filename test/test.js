window.onload = function () {
    // 声明依赖关系
    var loader = ezGame.loader;
    var input = ezGame.input;
    var shape = ezGame.shape;
    var Sprite = ezGame.sprite.Sprite;
    var SpriteSheet = ezGame.spriteSheet.SpriteSheet;
    var Scene = ezGame.scene.Scene;

    var floorY = 360;

    // 资源列表
    var resources = {
        startSrc      : "images/gamestart.png",
        backgroundSrc : "images/background.png",
        enemySrc      : "images/enemy.png",
        playerSrc     : "images/player.png",
        stoneSrc      : "images/stone.png",
        stoneSrc2     : "images/stone2.png",
        pillarSrc     : "images/pillar.png",
        bulletSrc     : "images/bullet.png"
    }

    var Player = function (options) {
        this.init(options);
    };
    ezGame.core.inherit(Player, Sprite);

    Player.prototype.initialize = function () {
        this.isJump = false;
        this.dir = 'right';
        this.moveDir = undefined;
        this.addAnimation(new SpriteSheet('PlayerRight', 'playerSrc', {frameSize: [50, 60], frameTotal: 3, duration: 100}));
        this.addAnimation(new SpriteSheet('PlayerLeft', 'playerSrc', {frameSize: [50, 60], frameTotal: 3, duration: 100, beginY: 60}));
    };

    Player.prototype.moveRight = function () {
        if(ezGame.core.isUndefined(this.moveDir) || this.moveDir !== 'right') {
            this.moveDir = 'right';
            this.setMovement({aX: 10, maxSpeedX: 8});
            this.setCurrentAnimation("PlayerRight");
        }
    };
    
    Player.prototype.moveLeft = function () {
        if(ezGame.core.isUndefined(this.moveDir) || this.moveDir !== 'left') {
            this.moveDir = 'left';
            this.setMovement({aX: -10, maxSpeedX: 8});
            this.setCurrentAnimation("PlayerLeft");
        }
    };

    Player.prototype.jump = function () {
        if(!this.isJump) {
            this.isJump = true;
            this.setMovement({aY: 60, speedY: -18});
            // 设置为中间的图像
            if(this.speedX < 0) {
                this.setCurrentImage('playerSrc', 100, 60);
            } 
            else if (this.speedX > 0){
                this.setCurrentImage('playerSrc', 100, 0);
            } 
            else {
                this.dir === 'right' ?  this.setCurrentImage("playerSrc", 100, 0) : this.setCurrentImage("playerSrc", 100, 60);
            }
        }  
    };

    Player.prototype.stopMove = function () {
        if(!this.isJump) {
            if(this.moveDir === 'right') {
                this.dir = this.moveDir;
            } 
            else if (this.moveDir === 'left'){
                this.dir = this.moveDir;
            }

            this.dir === 'right' ?  this.setCurrentImage("playerSrc", 0, 0) : this.setCurrentImage("playerSrc", 0, 60);

            this.moveDir = undefined;
            this.resetMovement();
        } 
    };

    Player.prototype.update = function () {

        // 跳跃结束
        var position = this.getRect();
        if(this.speedY > 0 && (position.bottom + 10 >= floorY)) {
            this.isJump = false;
            this.setPosition({y:floorY - this.height});
            this.setMovement({aY: 0, speedY: 0});
            if(this.speedX < 0) {
                this.setMovement({aX: -10, maxSpeedX: 8});
                this.setCurrentAnimation("PlayerLeft");
            }
            else if(this.speedX > 0) {
                this.setMovement({aX: 10, maxSpeedX: 8});
                this.setCurrentAnimation("PlayerRight");
            }
        }

        if(input.isPressed('up')) {
            if(!this.isJump) {
                this.jump();
            }
        }

        else if(input.isPressed('right') && !this.isJump) {
            this.moveRight();
        }

        else if(input.isPressed('left') && !this.isJump) {
            this.moveLeft();
        }
        else {
            this.stopMove();
        }

        this.constructor.uber.update.call(this);

    };

    Player.prototype.draw = function () {
        this.constructor.uber.draw.call(this);
    };

    // 图片加载成功handle
    var imageLoadSuccess = function () {
        var mario = new Player({x: 400, y: floorY - 60, imgX: 50, imgY: 60, width: 50, height: 60, aX: 6});
        mario.initialize();
        game.spriteList.push(mario);

        game.scene = new Scene(loader.loadedImgs['backgroundSrc'], {activityInterval: 50, isLoop: true});
        game.scene.setCenterPlayer(mario);
        game.scene.centerPlayer();

        loop.start();
    };

    // 图片加载失败handle
    var imageLoadFail = function () {
        alert("图片加载失败");
    };

    // 获得game对象
    var game = ezGame.init({
        bgColor: "#eee",
        size: [800, 400]
    });


    // 游戏逻辑更新
    game.update = function () {
        for(var len = this.spriteList.length, i = 0; i < len; i++) {
            this.spriteList[i].update()
        }

        if(game.scene.curPos.x < 0) {
            game.scene.clearCenterPlayer();
        } 

        if(game.scene.player.x > game.scene.centerX) {
            game.scene.centerPlayer();
        }
        
        this.scene.update();
    }

    // 游戏画面更新
    game.draw = function () {
        this.scene.draw();
        for(var len = this.spriteList.length, i = 0; i < len; i++) {
            this.spriteList[i].draw()
        }
    }
    
    // 获得游戏循环对象
    var loop = ezGame.loop.GameLoop(game);

    // 游戏入口界面
    function gameInit() {
        var backgroundImage = new Image();
        var marioImage = new Image();
        var winSize = {width: ezGame.canvas.width, height: ezGame.canvas.height};

        input.preventDefault(['right', 'left', 'up', 'down']);

        backgroundImage.src = resources.backgroundSrc;;
        marioImage.src = resources.playerSrc;
        backgroundImage.onload = function () {
            ezGame.context.drawImage(this, 0, 0);
            var str = '请按下空格开始游戏';
            var text = shape.Text(str, {x: winSize.width / 2 , y: 100, textAlign: 'center', font: '30px sans-serif', style: "red"});           
            text.draw();
            marioImage.onload = function () {
                ezGame.context.drawImage(this, 0, 0, 50, 60, winSize.width / 2 - 25, winSize.height - 160, 100, 120);
            }
        }

        input.onKeyDown("space", function() {
            loader.start(resources, game, imageLoadSuccess, imageLoadFail, 5000);
            input.clearDownCallbacks("space"); // 解绑定
        });

    }
    gameInit();
}
