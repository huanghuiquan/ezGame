YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Circle",
        "GameLoop",
        "Rect",
        "Scene",
        "Sprite",
        "SpriteSheet",
        "Text",
        "collision",
        "ezGame",
        "input",
        "loader",
        "shape",
        "utils"
    ],
    "modules": [
        "collision",
        "input",
        "loader",
        "loop",
        "scene",
        "shape",
        "sprite",
        "spriteSheet",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "collision",
            "name": "collision",
            "description": "碰撞检测模块\n该模块实现圆、矩形之间的碰撞检测，只要给detection函数传入两个对象，就能检测该对象的类型,并判断是否发生碰撞检测"
        },
        {
            "displayName": "input",
            "name": "input",
            "description": "输入模块\n该模块实现按键重命名(映射)、按键事件绑定、按键事件清除及禁止默认按键行为\n通过按键重映射，可以方便获得按键的名字，而不用记住按键的ascii码，\n如：需要绑定按键a，只需要`input.onKeyPress('a', function () {})`"
        },
        {
            "displayName": "loader",
            "name": "loader",
            "description": "资源加载器"
        },
        {
            "displayName": "loop",
            "name": "loop",
            "description": "游戏循环模块"
        },
        {
            "displayName": "scene",
            "name": "scene",
            "description": "场景模块"
        },
        {
            "displayName": "shape",
            "name": "shape",
            "description": "图形模块,包含点、矩形、圆、文本对象"
        },
        {
            "displayName": "sprite",
            "name": "sprite",
            "description": "精灵模块"
        },
        {
            "displayName": "spriteSheet",
            "name": "spriteSheet",
            "description": "动画栅模块\n即一组图片组成的动画，可通过设置为循环播放一组动画帧"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "工具模块"
        }
    ]
} };
});