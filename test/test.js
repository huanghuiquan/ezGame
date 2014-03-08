window.onload = function () {
    // 声明依赖关系
    var loader = ezGame.loader;
    var input = ezGame.input;
    var shape = ezGame.shape;

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
    
    // 图片加载成功handle
    var imageLoadSuccess = function () {
        alert("game start");
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
    }

    // 游戏画面更新
    game.draw = function () {
        ezGame.context.drawImage(ezGame.loader.loadedImgs.backgroundSrc, 0, 0);
    }
    
    // 获得游戏循环对象
    var loop = ezGame.loop.GameLoop(game);

    // 游戏入口界面
    function gameInit() {
        var backgroundImage = new Image();
        backgroundImage.src = 'images/background.png';
        backgroundImage.onload = function () {
            ezGame.context.drawImage(this, 0, 0);
            shape.Text('请按下空格开始', {x: 100, y: 100});           
        }

        input.onKeyDown("space", function() {
            loader.start(resources, game, imageLoadSuccess, imageLoadFail, 5000);
            input.clearDownCallbacks("space"); // 解绑定
        });
    }
    gameInit();
}
