window.onload = function() {
    // 声明依赖关系
    var loader = ezGame.loader;
    var utils = ezGame.utils;
    var input = ezGame.input;
    var collision = ezGame.collision;
    var shape = ezGame.shape;
    var GameLoop = ezGame.loop.GameLoop;
    var Scene = ezGame.scene.Scene;
    var Sprite = ezGame.sprite.Sprite;
    var SpriteSheet = ezGame.spriteSheet.SpriteSheet;

    // 资源列表
    var resources = {
        background: "images/background.png",
        bird: "images/bird.png",
        pillar: "images/pillar.png",
    };

    var pillarsMap = [
        [1, 5, 6, 7, 8],
        [1, 2, 6, 7, 8],
        [1, 2, 3, 7, 8],
        [1, 2, 3, 4, 8]
    ];

    var Bird = function(options) {
        this.init(options);
        this.addAnimation(new SpriteSheet('bird-static', 'bird', {
            frameSize: [40, 40]
        }));
    };
    utils.inherit(Bird, Sprite);

    Bird.prototype.update = function() {
        if (input.isPressed('space')) {
            this.jump();
        }

        if(this.y < 40) {
            this.y = 40;
        }

        var spriteList = game.spriteList;
        for (var i = 0, len = spriteList.length; i < len; i++) {
            if(spriteList[i] instanceof Pillar && collision.detection(this.getRect(), spriteList[i].getRect())) {
                this.setMovement({speedY: 10, speedX: 0});
                setTimeout(function () {
                    gameLoop.end();
                },3000);
            }  
        }

        this.constructor.uber.update.call(this);

        if(this.y >= 320) {
            this.y = 320;
            setTimeout(gameLoop.end, 0);
        }
    };

    Bird.prototype.jump = function() {
        this.setMovement({
            speedY: -6,
            aY:35 
        });
    };

    var Pillar = function(options) {
        this.init(options);
        this.addAnimation(new SpriteSheet('pillar', 'pillar', {
            frameSize: [40, 40]
        }));
        this.setCurrentAnimation("pillar");
        this.score = 1;
    };
    utils.inherit(Pillar, Sprite);

    Pillar.prototype.update = function () {
        this.constructor.uber.update.call(this);
        if (this.x < -40) {
            this.destroy();
        }
        if (this.x < 400 && this.score) {
            game.scoreBoard.score += 1;
            this.score = 0;
        }
    };

    var ScoreBoard = function() {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee();
        }
        this.score = 0;
    };

    ScoreBoard.prototype = {
        update: function() {
        },
        draw: function() {
            var text = shape.Text(Math.floor(this.score/5), {
                x: 400,
                y: 40,
                textAlign: 'center',
                font: '30px sans-serif',
                style: "green"
            });
            text.draw();
        }
    };

    // 获得游戏的实例化
    var game = ezGame.init({ width: 800, height: 400, bgColor: 'gray' });

    game.update = function () {
        for (var i = 0, len = this.spriteList.length; i < len; i++) {
            this.spriteList[i].update();
            if(this.spriteList[i].toDelete) {
                this.spriteList.splice(i, 1);
                len--;
                i--;
            }
        } 
        if (this.inScene instanceof this.scene.Scene) {
            this.inScene.update(this.spriteList);
        }
        this.scoreBoard.update();
    };

    game.draw = function () {
        if (this.inScene instanceof this.scene.Scene) {
            this.inScene.draw();
        }
        for (var i = 0, len = this.spriteList.length; i < len; i++) {
            this.spriteList[i].draw();
        } 
        this.scoreBoard.draw();
    }

    var gameLoop = new GameLoop(game);

    var loaderCompleted = function() {
        game.inScene = new Scene('background', { width: 800, height: 400, centerX: 400, isLoop: true });
        var bird = new Bird({ x: 400, y: 200, width: 40, height: 40 });
        bird.setCurrentAnimation('bird-static');

        game.inScene.draw();
        bird.update();
        bird.draw();
        game.spriteList.push(bird);

        game.scoreBoard = new ScoreBoard();

        input.preventDefault('space');
        input.onKeyDown('space', function() {
            input.clearDownCallbacks('space');
            setInterval(function (){
                var index = Math.floor(Math.random() * pillarsMap.length);
                for (var i = 0; i < pillarsMap[index].length; i++) {
                    game.spriteList.push(new Pillar({x: 800, y: pillarsMap[index][i] * 40, width: 40, height: 40}));
                }
            }, 1000);

            game.inScene.setCenterPlayer(bird);
            game.inScene.centerPlayer(bird);
            gameLoop.start();
            bird.setMovement({speedX: 3});
        });
    };

    var loaderFail = function() {
        alert("资源加载失败");
    };

    loader.start(resources, game, loaderCompleted, loaderFail, 30000);
}
