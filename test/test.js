window.onload = function () {
    // 声明依赖关系
    var loader = ezGame.loader;
    var input = ezGame.input;
    var shape = ezGame.shape;
    var Sprite = ezGame.sprite.Sprite;
    var SpriteSheet = ezGame.spriteSheet.SpriteSheet;
    var Scene = ezGame.scene.Scene;
    var collision = ezGame.collision;

    var floorY = 360;

    // 资源列表
    var resources = {
        startSrc      : "images/gamestart.png",
        backgroundSrc : "images/background.png",
        mushroomSrc   : "images/enemy.png",
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
        this.addAnimation(new SpriteSheet('PlayerRight', 'playerSrc', {frameSize: [50, 60], frameTotal: 3, duration: 100, isLoop: true}));
        this.addAnimation(new SpriteSheet('PlayerLeft', 'playerSrc', {frameSize: [50, 60], frameTotal: 3, duration: 100, isLoop: true, beginY: 60}));
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


    Player.prototype.die = function (){
        this.isDie = true;
        this.jump();
        setTimeout(function () {
            loop.end();
        }, 1000);
    }

    Player.prototype.update = function () {
        // 跳跃结束
        var position = this.getRect();
        if(!this.isDie && this.speedY > 0 && (position.bottom + 10 >= floorY)) {
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

        // 碰撞检测
        var spriteList = game.spriteList;
        for (var i = 0, len = game.spriteList.length; i < len; i++) {
            if(spriteList[i] instanceof this.constructor) continue;
            
            if(spriteList[i] instanceof Mushroom 
                && !spriteList[i].isDie 
                && collision.detection(spriteList[i].getRect(), this.getRect())) {
                if(this.speedY > 0) {
                    spriteList[i].die();
                } 
                else {
                    this.die();
                }
            }
        }

        if(game.scene.curPos.x < 5 && this.x < 5) {
            this.x = 5;
        }

        this.constructor.uber.update.call(this);

    };

    Player.prototype.draw = function () {
        this.constructor.uber.draw.call(this);
    };

    // 蘑菇
    var Mushroom = function (options) {
        if(!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.init(options);     
        this.addAnimation(new SpriteSheet('mushroom', 'mushroomSrc', {frameSize: [50, 48], frameTotal: 3}));
        this.setCurrentAnimation("mushroom");
        this.isDie = false;
    }
    ezGame.core.inherit(Mushroom, Sprite);

    // 转向
    Mushroom.prototype.turn = function () {
        this.speedX *= -1; 
    }

    // 蘑菇死亡
    Mushroom.prototype.die = function () {
        game.scoreBoard.score += 1;
        this.isDie = true;
        this.spriteSheet.nextFrame();
        this.setMovement({speedX: 0});
        var that = this;
        setTimeout(function () {
            that.spriteSheet.nextFrame();
            setTimeout(function () {
                var index = game.spriteList.indexOf(that);
                game.spriteList.splice(index, 1);
            }, 20);
        }, 20);
    };

    var ScoreBoard = function () {
        if(!(this instanceof arguments.callee)) {
            return new arguments.callee();
        }
        this.distance = 0;
        this.score = 0;
    };
    ScoreBoard.prototype = {
        update: function () {
            this.distance = game.scene.curPos.x;
        },
        draw: function () {
            var text = shape.Text(this.score, {x: 400 , y: 40, textAlign: 'center', font: '30px sans-serif', style: "green"});           
            text.draw();
        }
    };

    // 图片加载成功handle
    var imageLoadSuccess = function () {
        var mario = new Player({x: 400, y: floorY - 60, imgX: 50, imgY: 60, width: 50, height: 60, aX: 6, maxSpeedX: 8});
        mario.initialize();
        game.spriteList.push(mario);

        setInterval(function () {
            var mushroom = new Mushroom({x: 2000, y: floorY - 45, imgX: 50, imgY: 48, width: 50, height: 48, speedX: -4});
            game.spriteList.push(mushroom);
        }, 1000);

        game.scene = new Scene(loader.loadedImgs['backgroundSrc'], {activityInterval: 50, isLoop: true});
        game.scene.setCenterPlayer(mario);
        game.scene.centerPlayer();

        game.scoreBoard = new ScoreBoard();

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
        
        this.scene.update(game.spriteList);
        
        this.scoreBoard.update();
        
    }

    // 游戏画面更新
    game.draw = function () {
        this.scene.draw();
        for(var len = this.spriteList.length, i = 0; i < len; i++) {
            this.spriteList[i].draw()
        }

        this.scoreBoard.draw();
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
