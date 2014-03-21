/*
 * A easy Javascript 2D game framework base HTML5.
 * @author huanghuiquan
 * @name ezGame
 */

(function(window, undefined) {
    var document = window.document;
    /**
     * ezGame的主类, 可通过其ezGame.register方法扩展
     * @class ezGame
     */
    var ezGame = {
        /**
         * ezGame实例的初始化
         * @method init
         * @for ezGame
         * @param {Object} options ezGame实例的初始化参数
         * @param {Number} options.width 游戏窗口宽度
         * @param {Number} options.height 游戏窗口高度
         * @param {String} options.bgColor 游戏窗口背景颜色
         * @param {Number} options.fps 游戏界面的每秒刷新帧数
         * @return {Object} 返回新构建的ezGame实例
         */
        init: function(options) {
            defaultOptions = {
                width: 400,
                height: 400,
                bgColor: "#fff",
                fps: 60,
            };
            options = this.utils.extend(defaultOptions, options);

            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext('2d');
            this.width = options.width;
            this.height = options.height;
            this.canvas.width = options.width;
            this.canvas.height = options.height;
            this.bgColor = options.bgColor;
            this.fps = options.fps;

            // 游戏中的精灵数组 
            this.spriteList = [];

            this.canvas.style.width = this.width;
            this.canvas.style.height = this.height;
            this.canvas.style.backgroundColor = this.bgColor;
            var wrap = options.wrap || "body";
            this.utils.$(wrap)[0].appendChild(this.canvas); //将canvas 添加到网页中
            this.canvas.position = this.utils.getElementPos(this.canvas);
            this.canvas.x = this.x = this.canvas.position.x;
            this.canvas.y = this.y = this.canvas.position.y;

            return this;
        },

        /**
         * 模块注册, 可以将各个模块的注册到主类中，以达到扩展ezGame的作用
         * @example
         *      ezGame.register('event', function (eg){
         *          ...
         *      });
         *
         *      // 然后可以通过`ezGame.event`来使用该模块的类
         * @method register
         * @for ezGame
         * @param {String} namespace 模块名
         * @param {Function(ezGame)} func 回调函数，在里面写下模块的具体内容,回调函数包含一个ezGame实例参数
         * @return {undefined} 返回空值
         */
        register: function(namespace, func) {
            var ns = namespace.split("."),
                parent = this;
            for (var i = 0; i < ns.length; i++) {
                parent[ns[i]] = parent[ns[i]] === undefined ? {} : parent[ns[i]];
                parent = parent[ns[i]];
            }
            if (func) {
                func.call(parent, this);
            }

        },

        /**
         * 更新游戏逻辑，包括所有精灵及场景
         * @method update
         * @for ezGame
         */
        update: function () {
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
        },

        /**
         * 渲染游戏界面，包括所有精灵及场景
         * @method draw
         * @for ezGame
         */
        draw: function () {
            if (this.inScene instanceof this.scene.Scene) {
                this.inScene.draw();
            }
            for (var i = 0, len = this.spriteList.length; i < len; i++) {
                this.spriteList[i].draw();
            } 
        }
    };
    window["ezGame"] = ezGame;
})(window);

/**
 * 工具模块
 * @module utils
 */
ezGame.register('utils', function(eg) {
    /**
     * ezGame的选择器，返回选中的元素的集合
     * @method $
     * @static
     * @for utils
     * @param {String} id 选择器
     * @param {HTMLNode} parent 父元素，默认为document
     * @return {Array} 选中元素的集合
     */
    this.$ = function(id, parent) {
        parent = parent || document;
        return parent.querySelectorAll(id);
    }

    /**
     * 类继承辅助函数, 不继承父对象的实例属性,只继承父对象的原型
     * @method inherit
     * @static
     * @for utils
     * @param {Object} C 子对象
     * @param {Object} P 父对象
     * @return {undefined}
     */
    this.inherit = function(C, P) {
        var F = function() {};
        return function(C, P) {
            F.prototype = P.prototype;
            C.prototype = new F();
            C.uber = P.prototype;
            C.prototype.constructor = C;
        }
    }();

    /**
     * 判断参数是否为undefined
     * @method isUndefined
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果为undefined返回true
     */
    this.isUndefined = function(elem) {
        return typeof elem === 'undefined';
    };

    /**
     * 判断参数是否为数组
     * @method isArray
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果为数组返回true,否则返回false
     */
    this.isArray = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Array]";
    };

    /**
     * 判断参数是否为Object类型(除了Number,String,Boolean,undefined,null基本类型外的其他类型)
     * @method isObject
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果变量为对象返回true,否则返回false
     */
    this.isObject = function(elem) {
        return elem === Object(elem);
    };

    /**
     * 判断参数是否为字符串类型
     * @method isString
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果变量为字符串返回true,否则返回false
     */
    this.isString = function(elem) {
        return Object.prototype.toString.call(elem) === "[object String]";
    };

    /**
     * 判断参数是否为数值类型
     * @method isNumber
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果变量为数字返回true,否则返回false
     */
    this.isNumber = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Number]";
    };

    /**
     * 判断参数是否为function类型
     * @method isFunction
     * @static
     * @for utils
     * @param {Object} elem 目标变量
     * @return {Boolean} 如果变量为函数返回true,否则返回false
     */
    this.isFunction = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Function]";
    };

    /**
     * 复制对象属性
     * @method extend
     * @static
     * @for utils
     * @param {Object} destination 被扩展的对象
     * @param {Object} source 扩展来源
     * @prama {Boolean} isCover 是否覆盖原有属性,默认true
     * return {Object} 返回已被扩展的目标对象
     */
    this.extend = function(destination, source, isCover) {
        var isUndefined = this.isUndefined;
        (isUndefined(isCover)) && (isCover = true);
        for (var name in source) {
            if (isCover || isUndefined(destination[name])) {
                destination[name] = source[name];
            }
        }
        return destination;
    };

    /**
     * 计算对象属性的数量， 注意：不包含继承属性
     * @method count
     * @static
     * @for utils
     * @param {Object} obj  目标对象
     * @return {Number} 除掉继承外的属性数量
     */
    this.count = function(obj) {
        var counter = 0;
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                counter++;
            }
        }
        return counter;
    }

    /**
     * 清除当前窗口的所有颜色
     * @method clearCanvas
     * @static
     * @for utils
     * @return {Object} 返回该窗口的引用this
     */
    this.clearCanvas = function() {
        eg.context.clearRect(0, 0, eg.width, eg.height);
        return this;
    }

    /**
     * 获取元素在页面中的位置
     * @method getElementPos
     * @static
     * @for utils
     * @param {HTMLElement} element DOM元素
     * @return {Object} left和top的值
     */
    this.getElementPos = function(element) {
        var left = 0;
        var top = 0;
        while (element.offsetParent) {
            left += element.offsetLeft;
            top += element.offsetTop;
            element = element.offsetParent;
        }
        return {
            x: left,
            y: top
        };
    }
});

/**
 * 资源加载器
 * @module loader
 */
ezGame.register("loader", function(eg) {

    /** 
     * 图片总数
     * @attribue total
     * @type Number
     */
    this.total = 0;

    /** 
     * 图片已加载数
     * @attribue loadedCount
     * @type Number
     */
    this.loadedCount = 0;

    /** 
     * 图片已加载百分比
     * @attribue loadedPercent
     * @type Number
     */
    this.loadedPercent = 0;

    /** 
     * 正在加载中的图片
     * @attribue loadingImgs
     * @type Object
     */
    this.loadingImgs = {};

    /** 
     * 已加载完成的图片集合
     * @attribue loadedImgs
     * @type Object
     */
    this.loadedImgs = {};

    /** 
     * 加载失败的图片集
     * @attribue loadFailImgs
     * @type Object
     */
    this.loadFailImgs = {};

    /**
     * 开始加载资源
     * @method start
     * @static
     * @for loader
     * @param {Object} items 资源列表
     * @param {Object} gameObj 游戏对象
     * @param {Function(gameObj, loader)} callbackforsuccess 加载成功是调用
     * @param {Function(gameObj, loader)} callbackforfail 加载失败时调用
     * @param {Number} timeout 预设最长加载时间,默认30s，如果，超过时间则设置为加载失败
     */
    this.start = function(items, gameObj, callbackForSuccess, callbackForFail, timeout) {
        this.total = eg.utils.count(items);
        for (var item in items) {
            this.loadingImgs[item] = new Image();
            this.loadingImgs[item].src = items[item];
            this.loadingImgs[item].onload = (function(that, name) {
                return function() {
                    that.loadedCount++;
                    that.loadedImgs[name] = that.loadingImgs[name];
                    that.loadedPercent = Math.floor(that.loadedCount / that.total * 100);

                    if (that.total === that.loadedCount) {
                        clearTimeout(sid);
                        callbackForSuccess(gameObj, that);
                    }
                }
            })(this, item);
        }

        var timeout = timeout || 30000;
        var sid = setTimeout((function(that) {
            return function() {
                if (that.loadedCount !== that.total) {
                    for (var i in that.loadingImgs) {
                        if (!(i in that.loadedImgs)) {
                            that.loadFailImgs[i] = that.loadingImgs[i].src;
                        }
                    }
                    if ((typeof callbackForFail) !== "undefined") {
                        callbackForFail(gameObj, that);
                    }
                }
            };
        })(this), timeout);
    };

    /**
     * 通过图片名获取图片对象
     * @method getImage
     * @static
     * @for loader
     * @param {String|Image} name 图片名
     * @return {Image|undefined} 返回name对应的图像对象
     */
    this.getImage = function(name) {
        return name.toString() === '[object HTMLImageElement]' ? name : this.loadedImgs[name];
    };
});


/**
 * 图形模块,包含点、矩形、圆、文本对象
 * @module shape
 */
ezGame.register("shape", function(eg) {

    /**
     * 更新right和bottom的值
     * @prama {Shape} elem 图形对象
     */
    var _resetRightBottom = function(elem) {
        elem.right = elem.x + elem.width;
        elem.bottom = elem.y + elem.height;
    }

    /**
     * 矩形对象
     * @class Rect
     * @constructor
     * @param {Object} options 初始化参数
     * @param {Number} options.x 矩形在画布上的x坐标，默认`0`
     * @param {Number} options.y 矩形在画布上的y坐标, 默认`0`
     * @param {Number} options.width 矩形宽度, 默认`100`
     * @param {Number} options.height 矩形高度, 默认`100`
     * @param {String} options.style 矩形的颜色, 默认`red`
     * @param {Boolean} options.isFill 是否填充矩形, 默认`true`
     * @return {Rect} 返回矩形对象实例
     */
    var Rect = function(options) {
        // 如果以ezGame.rect(options) 形式调用则return new rect(options)，避免直接调用函数
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.init(options);
    };
    Rect.prototype = {
        /**
         * 矩形对象的初始化函数
         * @method init
         * @for Rect
         * @param {Object} options 初始化参数
         * @param {Number} options.x 矩形在画布上的x坐标，默认`0`
         * @param {Number} options.y 矩形在画布上的y坐标, 默认`0`
         * @param {Number} options.width 矩形宽度, 默认`100`
         * @param {Number} options.height 矩形高度, 默认`100`
         * @param {String} options.style 矩形的颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充矩形, 默认`true`
         * @return {Rect} 返回矩形对象实例
         */
        init: function(options) {
            var defaultOptions = {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                style: "red",
                isFill: true
            };
            options = options || {};
            options = eg.utils.extend(defaultOptions, options);
            this.setOptions(options);

            _resetRightBottom(this);
        },

        /**
         * 设置参数
         * @method setOptions
         * @for Rect
         * @param {Object} options 初始化参数
         * @param {Number} options.x 矩形在画布上的x坐标，默认`0`
         * @param {Number} options.y 矩形在画布上的y坐标, 默认`0`
         * @param {Number} options.width 矩形宽度, 默认`100`
         * @param {Number} options.height 矩形高度, 默认`100`
         * @param {String} options.style 矩形的颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充矩形, 默认`true`
         * @returns {Rect} 返回矩形对象this的引用
         */
        setOptions: function(options) {
            this.x = eg.utils.isNumber(options.x) ? options.x : this.x;
            this.y = eg.utils.isNumber(options.y) ? options.y : this.y;
            this.width = eg.utils.isNumber(options.width) ? options.width : this.width;
            this.height = eg.utils.isNumber(options.height) ? options.height : this.height;
            this.style = options.style || this.style;
            this.isFill = eg.utils.isUndefined(options.isFill) ? this.isFill : options.isFill;
            return this;
        },

        /**
         * 绘制矩形
         * @method draw
         * @for Rect
         * @returns {Rect} 返回矩形对象this的引用
         */
        draw: function() {
            var context = eg.context;
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fillRect(this.x, this.y, this.width, this.height);
            } else {
                context.strokeStyle = this.style;
                context.strokeRect(this.x, this.y, this.width, this.height);
            }
            return this;
        },

        /**
         * 将矩形移动一定距离
         * @method move
         * @for Rect
         * @param {Number} dx x轴上的增量
         * @param {Number} dy y轴上的增量
         * @returns {Rect} 返回矩形对象this的引用
         */
        move: function(dx, dy) {
            dx = dx || 0;
            dy = dy || 0;
            this.x += dx;
            this.y += dy;

            _resetRightBottom(this);
            return this;
        },

        /**
         * 将矩形移动到特定位置
         * @method moveTo
         * @for Rect
         * @param {Number} x x轴位置
         * @param {Number} y y轴位置
         * @returns {Rect} 返回矩形对象this的引用
         */
        moveTo: function(x, y) {
            x = eg.utils.isNumber(x) ? x : this.x;
            y = eg.utils.isNumber(y) ? y : this.y;
            this.x = x;
            this.y = y;
            _resetRightBottom(this);
            return this;
        },

        /**
         * 将矩形放大或者缩小
         * @method resize
         * @for Rect
         * @param {Number} w 宽度的增量
         * @param {Number} h 高度的增量
         * @returns {Rect} 返回矩形对象this的引用
         */
        resize: function(w, h) {
            w = w || 0;
            h = h || 0;
            this.width += w;
            this.height += h;
            _resetRightBottom(this);
            return this;
        },

        /**
         * 将矩形改变到特定大小
         * @method resizeTo
         * @for Rect
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @returns {Rect} 返回矩形对象this的引用
         */
        resizeTo: function(width, height) {
            width = width || this.width;
            height = height || this.height;
            this.width = width;
            this.height = height;
            _resetRightBottom(this);
            return this;
        }
    }

    /**
     * 圆形对象
     * @class Circle
     * @constructor
     * @param {Object} options 初始化参数
     * @param {Number} options.x 圆心的x坐标,默认`100`
     * @param {Number} options.y 圆心的y坐标,默认`100`
     * @param {Number} options.r 圆的半径, 默认`100`
     * @param {Number} options.startAngle 开始画圆的开始角度, 默认`0`
     * @param {Number} options.endAngle 圆的开始角度结束角度, 默认`2*PI`
     * @param {Boolean} options.antiClock 逆时针画圆，默认`true`
     * @param {String} options.style 圆的颜色, 默认`red`
     * @param {Boolean} options.isFill 是否填充圆, 默认`true`
     * @return {Circle} 返回实例Circle的引用
     */
    var Circle = function(options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.init(options);
    }
    Circle.prototype = {
        /**
         * 圆对象的初始化函数
         * @method init
         * @for Circle
         * @param {Object} options 初始化参数
         * @param {Number} options.x 圆心的x坐标,默认`100`
         * @param {Number} options.y 圆心的y坐标,默认`100`
         * @param {Number} options.r 圆的半径, 默认`100`
         * @param {Number} options.startAngle 开始画圆的开始角度, 默认`0`
         * @param {Number} options.endAngle 圆的开始角度结束角度, 默认`2*PI`
         * @param {Boolean} options.antiClock 逆时针画圆，默认`true`
         * @param {String} options.style 圆的颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充圆, 默认`true`
         * @return {Circle} 返回实例Circle的引用
         */
        init: function(options) {
            //默认参数
            var defaultOptions = {
                x: 100,
                y: 100,
                r: 100,
                startAngle: 0,
                endAngle: Math.PI * 2,
                antiClock: false, //逆时针
                style: "red",
                isFill: true
            };
            options = options || {};
            options = eg.utils.extend(defaultOptions, options);
            this.setOptions(options);
        },

        /**
         * 设置参数
         * 圆对象的初始化函数
         * @method setOptions
         * @for Circle
         * @param {Object} options 初始化参数
         * @param {Number} options.x 圆心的x坐标,默认`100`
         * @param {Number} options.y 圆心的y坐标,默认`100`
         * @param {Number} options.r 圆的半径, 默认`100`
         * @param {Number} options.startAngle 开始画圆的开始角度, 默认`0`
         * @param {Number} options.endAngle 圆的开始角度结束角度, 默认`2*PI`
         * @param {Boolean} options.antiClock 逆时针画圆，默认`true`
         * @param {String} options.style 圆的颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充圆, 默认`true`
         * @return {Circle} 返回实例Circle的引用
         */
        setOptions: function(options) {
            this.x = eg.utils.isNumber(options.x) ? options.x : this.x;
            this.y = eg.utils.isNumber(options.y) ? options.y : this.y;
            this.r = eg.utils.isNumber(options.r) ? options.r : this.r;
            this.startAngle = eg.utils.isNumber(options.startAngle) ? options.startAngle : this.startAngle;
            this.endAngle = eg.utils.isNumber(options.endAngle) ? options.endAngle : this.endAngle;
            this.antiClock = eg.utils.isUndefined(options.antiClock) ? this.antiClock : options.antiClock;
            this.style = options.style || this.style;
            this.isFill = eg.utils.isUndefined(options.isFill) ? this.isFill : options.isFill;
            return this;
        },

        /**
         * 绘制圆形
         * @method draw
         * @for Circle
         * @returns {Circle} 返回Circle实例this的引用
         */
        draw: function() {
            var context = eg.context;
            context.beginPath();
            context.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, this.antiClock);
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fill();
            } else {
                context.strokeStyle = this.style;
                context.stroke();
            }
            context.closePath();
            return this;
        },

        /**
         * 将圆形移动一定距离
         * @method move
         * @for Circle
         * @param {Number} dx x轴上的增量
         * @param {Number} dy y轴上的增量
         * @returns {Circle} 返回Circle实例this的引用
         */
        move: function(dx, dy) {
            dx = dx || 0;
            dy = dy || 0;
            this.x += dx;
            this.y += dy;
            return this;
        },

        /**
         * 将圆形移动到特定位置
         * @method moveTo
         * @for Circle
         * @param {Number} x x轴位置
         * @param {Number} y y轴位置
         * @returns {Circle} 返回Circle实例this的引用
         */
        moveTo: function(x, y) {
            x = eg.utils.isNumber(x) ? x : this.x;
            y = eg.utils.isNumber(y) ? y : this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        /**
         * 放大或者缩小圆形
         * @method resize
         * @for Circle
         * @param {Number} dr 半径增量
         * @returns {Circle} 返回Circle实例this的引用
         */
        resize: function(dr) {
            dr = dr || 0;
            this.r += dr;
            return this;
        },

        /**
         * 将圆形改变到特定大小
         * @method resizeTo
         * @for Circle
         * @param {Number} r 半径
         * @returns {Circle} 返回Circle实例this的引用
         */
        resizeTo: function(r) {
            r = eg.utils.isNumber(r) ? r : this.r;
            this.r = r;
            return this;
        }
    }

    /**
     * 文本对象
     * @class Text
     * @constructor
     * @param {String} text 文本内容
     * @param {Object} options 初始化参数
     * @param {Number} options.x 文本的x坐标,默认`100`
     * @param {Number} options.y 文本的y坐标,默认`100`
     * @param {String} options.style 文本颜色, 默认`red`
     * @param {Boolean} options.isFill 是否填充文本, 默认`true`
     * @param {String} options.font 字体类型, 默认`14px sans-serif`
     * @return {Text} 返回实例Text的引用
     */
    var Text = function(text, options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(text, options);
        }
        this.init(text, options);
    }
    Text.prototype = {
        /**
         * 参数初始化
         * @method init
         * @for Text
         * @param {String} text 文本内容
         * @param {Object} options 初始化参数
         * @param {Number} options.x 文本的x坐标,默认`100`
         * @param {Number} options.y 文本的y坐标,默认`100`
         * @param {String} options.style 文本颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充文本, 默认`true`
         * @param {String} options.font 字体类型, 默认`14px sans-serif`
         * @return {Text} 返回实例Text的引用
         */
        init: function(text, options) {
            // 默认值对象
            var defaultOptions = {
                x: 100,
                y: 100,
                style: "red",
                isFill: true,
                font: '14px sans-serif',
            };

            options = options || {};
            options = eg.utils.extend(defaultOptions, options);
            this.setOptions(options);
            this.text = text;
        },

        /**
         * 设置参数
         * @method setoptions
         * @for Text
         * @param {Object} options 参数列表
         * @param {Number} options.x 文本的x坐标,默认`100`
         * @param {Number} options.y 文本的y坐标,默认`100`
         * @param {String} options.style 文本颜色, 默认`red`
         * @param {Boolean} options.isFill 是否填充文本, 默认`true`
         * @param {String} options.font 字体类型, 默认`14px sans-serif`
         * @return {Text} 返回实例Text的引用
         */
        setOptions: function(options) {
            this.x = options.x || this.x;
            this.y = options.y || this.y;
            this.maxWidth = options.maxWidth || this.maxWidth;
            this.font = options.font || this.font;
            this.textBaseline = options.textBaseline || this.textBaseline;
            this.textAlign = options.textAlign || this.textAlign;
            this.isFill = options.isFill || this.isFill;
            this.style = options.style || this.style;
            return this;
        },

        /**
         * 将文字渲染到canvas
         * @method draw
         * @for Text
         * @return {Text} 返回实例Text的引用
         */
        draw: function() {
            var context = eg.context;
            (!eg.utils.isUndefined(this.font)) && (context.font = this.font);
            (!eg.utils.isUndefined(this.textBaseline)) && (context.textBaseline = this.textBaseline);
            (!eg.utils.isUndefined(this.textAlign)) && (context.textAlign = this.textAlign);
            (!eg.utils.isUndefined(this.maxWidth)) && (context.maxWidth = this.maxWidth);
            if (this.isFill) {
                context.fillStyle = this.style;
                this.maxWidth ? context.fillText(this.text, this.x, this.y, this.maxWidth) : context.fillText(this.text, this.x, this.y);
            } else {
                context.strokeStyle = this.style;
                this.maxWidth ? context.strokeText(this.text, this.x, this.y, this.maxWidth) : context.strokeText(this.text, this.x, this.y);
            }
            return this;
        },
    }

    /**
     * 判断对象是否是矩形
     * @method isRect
     * @for shape
     * @static
     * @param {Object} 目标对象
     * @return {Boolean} shape为矩形返回true
     */
    this.isRect = function(shape) {
        return shape instanceof Rect;
    }

    /**
     * 判断对象是否是Circle
     * @method isCircle
     * @for shape
     * @static
     * @param {Object} 目标对象
     * @return {Boolean} shape为圆返回true
     */
    this.isCircle = function(shape) {
        return shape instanceof Circle;
    }

    /**
     * 判断对象是否是Text
     * @method isText
     * @for shape
     * @static
     * @param {Object} 目标对象
     * @return {Boolean} shape为文本对象返回true
     */
    this.isText = function(shape) {
        return shape instanceof Text;
    }

    this.Rect = Rect;
    this.Circle = Circle;
    this.Text = Text;
});


/**
 * 输入模块
 * 该模块实现按键重命名(映射)、按键事件绑定、按键事件清除及禁止默认按键行为
 * 通过按键重映射，可以方便获得按键的名字，而不用记住按键的ascii码，
 * 如：需要绑定按键a，只需要`input.onKeyPress('a', function () {})`
 * @module input
 */
ezGame.register("input", function(eg) {
    this.mouseX = 0;
    this.mouseY = 0;

    var recordMouseMove = function(eve) {
        var pageX,
            pageY,
            x,
            y;
        pageX = eve.pageX || eve.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        pageY = eve.pageY || eve.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
        eg.input.mouseX = pageX - eg.canvas.x;
        eg.input.mouseY = pageY - eg.canvas.y;
    };
    window.addEventListener("mousemove", recordMouseMove);

    // 被按下的键的集合
    var pressed_keys = {};
    // 要求禁止默认行为的键的集合
    var preventDefault_keys = {};
    // 键盘按下触发的处理函数
    var keydown_callbacks = {};
    // 键盘弹起触发的处理函数
    var keyup_callbacks = {};

    // 键盘编码映射
    var k = [];
    k[8] = "backspace";
    k[9] = "tab";
    k[13] = "enter";
    k[16] = "shift";
    k[17] = "ctrl";
    k[18] = "alt";
    k[19] = "pause";
    k[20] = "capslock";
    k[27] = "esc";
    k[32] = "space";
    k[33] = "pageup";
    k[34] = "pagedown";
    k[35] = "end";
    k[36] = "home";
    k[37] = "left";
    k[38] = "up";
    k[39] = "right";
    k[40] = "down";
    k[45] = "insert";
    k[46] = "delete";

    k[91] = "leftwindowkey";
    k[92] = "rightwindowkey";
    k[93] = "selectkey";
    k[106] = "multiply";
    k[107] = "add";
    k[109] = "subtract";
    k[110] = "decimalpoint";
    k[111] = "divide";

    k[144] = "numlock";
    k[145] = "scrollock";
    k[186] = "semicolon";
    k[187] = "equalsign";
    k[188] = "comma";
    k[189] = "dash";
    k[190] = "period";
    k[191] = "forwardslash";
    k[192] = "graveaccent";
    k[219] = "openbracket";
    k[220] = "backslash";
    k[221] = "closebracket";
    k[222] = "singlequote";

    var numpadkeys = ["numpad1", "numpad2", "numpad3", "numpad4", "numpad5", "numpad6", "numpad7", "numpad8", "numpad9"];
    var fkeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"];
    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (var i = 0; numbers[i]; i++) {
        k[48 + i] = numbers[i]
    }
    for (var i = 0; letters[i]; i++) {
        k[65 + i] = letters[i]
    }
    for (var i = 0; numpadkeys[i]; i++) {
        k[96 + i] = numpadkeys[i]
    }
    for (var i = 0; fkeys[i]; i++) {
        k[112 + i] = fkeys[i]
    }

    /**
     * 记录键盘按下的键,并运行注册在该事件上的函数
     */
    var recordPress = function(eve) {
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = true;
        if (keydown_callbacks[keyName]) {
            for (var i = 0, len = keydown_callbacks[keyName].length; i < len; i++) {
                keydown_callbacks[keyName][i]();
            }
        }
        if (keydown_callbacks["allKeys"]) {
            for (var i = 0, len = keydown_callbacks["allKeys"].length; i < len; i++) {
                keydown_callbacks["allKeys"][i]();
            }
        }
        if (preventDefault_keys[keyName]) {
            eve.preventDefault();
        }
    }

    /**
     * 记录键盘松开的键,并运行注册在该事件上的函数
     */
    var recordUp = function(eve) {
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = false;
        if (keyup_callbacks[keyName]) {
            for (var i = 0, len = keyup_callbacks[keyName].length; i < len; i++) {
                keyup_callbacks[keyName][i]();
            }
        }
        if (keyup_callbacks["allKeys"]) {
            for (var i = 0, len = keyup_callbacks["allKeys"].length; i < len; i++) {
                keyup_callbacks["allKeys"][i]();
            }
        }
        if (preventDefault_keys[keyName]) {
            eve.preventDefault();
        }
    }
    window.addEventListener("keydown", recordPress);
    window.addEventListener("keyup", recordUp);

    /**
     * 判断某个键是否按下
     * @method isPressed
     * @for input
     * @static
     * @param {String} keyName 按键名
     * @return {Boolean} 如果被按下，则返回true
     */
    this.isPressed = function(keyName) {
        return !!pressed_keys[keyName];
    };

    /**
     * 禁止某个键按下的默认行为
     * @method preventDefault
     * @for input
     * @static
     * @param {Array|String} keyName 要禁止默认行为的按键
     */
    this.preventDefault = function(keyName) {
        if (eg.utils.isArray(keyName)) {
            for (var i = 0, len = keyName.length; i < len; i++) {
                arguments.callee.call(this, keyName[i]);
            }
        } else {
            preventDefault_keys[keyName] = true;
        }
    }

    /**
     * 绑定键盘按下事件, 可绑定多个事件
     * @method onKeyDown
     * @for input
     * @static
     * @param {String} keyName 按键名字
     * @param {Function} handler 事件函数
     */
    this.onKeyDown = function(keyName, handler) {
        keyName = keyName || "allKeys";
        if (eg.utils.isUndefined(keydown_callbacks[keyName])) {
            keydown_callbacks[keyName] = [];
        }
        keydown_callbacks[keyName].push(handler);
    }

    /**
     * 绑定键盘弹起事件, 可绑定多个事件
     * @method onKeyUp
     * @for input
     * @static
     * @param {String} keyName 按键名字
     * @param {Function} handler 事件函数
     */
    this.onKeyUp = function(keyName, handler) {
        keyName = keyName || "allKeys";
        if (eg.utils.isUndefined(keyup_callbacks[keyName])) {
            keyup_callbacks[keyName] = [];
        }
        keyup_callbacks[keyName].push(handler);
    }

    /**
     * 清除键盘按下事件处理程序
     * @method clearDownCallbacks
     * @for input
     * @static
     * @param {String} keyName 按键名，为空时清除所有按键按下事件
     */
    this.clearDownCallbacks = function(keyName) {
        if (keyName) {
            keydown_callbacks[keyName] = [];
        } else {
            keydown_callbacks = {};
        }
    }

    /**
     * 清除键盘按键松开事件处理程序
     * @method clearUpCallbacks
     * @for input
     * @static
     * @param {String} keyName 按键名，为空时清除所有按键松开事件
     */
    this.clearUpCallbacks = function(keyName) {
        if (keyName) {
            keyup_callbacks[keyName] = [];
        } else {
            keyup_callbacks = {};
        }
    }
});

/**
 * 碰撞检测模块
 * 该模块实现圆、矩形之间的碰撞检测，只要给detection函数传入两个对象，就能检测该对象的类型,并判断是否发生碰撞检测
 * @module collision
 */
ezGame.register("collision", function(eg) {
    var shape = eg.shape;
    var pow = Math.pow;
    /**
     * 判断两个对象是否发生碰撞
     * @method detection
     * @for collision
     * @static
     * @param {Rect|Circle} objectA 对象A，可为圆或矩形
     * @param {Rect|Circle} objectB 对象B，可为圆或矩形
     * @return {Boolean} 如果发生碰撞，则返回true, 否则false
     */
    this.detection = function(objectA, objectB) {
        // 圆 和 矩形 的碰撞
        if (shape.isCircle(objectA) && shape.isRect(objectB)) {
            return (objectA.x + objectA.r >= objectB.x && objectA.x - objectA.r <= objectB.right && objectA.y + objectA.r >= objectB.y && objectA.y - objectA.r <= objectB.bottom);
        }
        if (shape.isRect(objectA) && shape.isCircle(objectB)) {
            return this.detection(objectB, objectA);
        }

        // 矩形和矩形的碰撞 限制：只能是两个矩形都是平行的
        if (shape.isRect(objectA) && shape.isRect(objectB)) {
            //return ((objectA.right > objectB.x && objectA.right < objectB.right || objectA.x > objectB.x && objectA.x < objectB.right) 
            //&& (objectA.bottom > objectB.y && objectA.bottom < objectB.bottom || objectA.y < objectB.bottom && objectA.y > objectB.y) 
            //|| (objectB.right > objectA.x && objectB.right < objectA.right || objectB.x > objectA.x && objectB.x < objectA.right) 
            //&& (objectB.bottom > objectA.y && objectB.bottom < objectA.bottom || objectB.y < objectA.bottom && objectB.y > objectA.y) );
            return ((objectA.right > objectB.x && objectA.x < objectB.right) && (objectA.bottom > objectB.y && objectA.y < objectB.bottom));
        }

        // 圆和圆的碰撞
        if (shape.isCircle(objectA) && shape.isCircle(objectB)) {
            return (pow(objectA.x - objectB.x, 2) + pow(objectA.y - objectB.y, 2) <= pow(objectB.r + objectA.r, 2));
        }
        return fasle;
    }

});

/**
 * 游戏循环模块
 * @module loop
 */
ezGame.register("loop", function(eg) {
    var tid, interval;

    var loop = function() {
        var _this = this;
        return function() {
            if (!_this.pause && !_this.stop) {

                _this.now = new Date().getTime();
                _this.duration = _this.now - _this.duration;

                if (_this.gameObj.update) {
                    _this.gameObj.update();
                }

                if (_this.gameObj.draw) {
                    eg.utils.clearCanvas();
                    _this.gameObj.draw();
                }
            }
            tid = window.setTimeout(arguments.callee, interval);
        }
    }

    /**
     * 游戏循环对象
     * @class GameLoop
     * @constructor
     * @param {ezGame} gameObj 游戏对象的引用
     * @param {Object} options 设置循环的参数
     * @param {Number} options.fps 每秒刷新的帧数
     * @return {GameLoop} 返回GameLoop的实例引用
     */
    var GameLoop = function(gameObj, options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(gameObj, options);
        }
        this.init(gameObj, options);
    }

    GameLoop.prototype = {
        /**
         * 实例初始化
         * @method init
         * @for GameLoop
         * @param {Object} options 设置循环的参数
         * @param {Number} options.fps 每秒刷新的帧数
         * @return {GameLoop} 返回GameLoop的实例引用
         */
        init: function(gameObj, options) {
            var defaultOptions = {
                fps: gameObj.fps
            };
            options = options || {};

            options = eg.utils.extend(defaultOptions, options);
            this.gameObj = gameObj;
            this.fps = options.fps;
            interval = 1000 / this.fps;

            this.pause = false;
            this.stop = true;
        },

        /**
         * 设置循环开始
         * @method start
         * @for GameLoop
         */
        start: function() {
            if (this.stop) { //如果是结束状态则可以开始
                this.stop = false;
                this.now = new Date().getTime();
                this.startTime = new Date().getTime();
                this.duration = 0;
                loop.call(this)();
            }
        },

        /**
         * 将游戏循环从暂停状态设置为运行状态
         * @method run
         * @for GameLoop
         */
        run: function() {
            this.pause = false;
        },

        /**
         * 将游戏循环从运行状态设置为暂停状态
         * @method pause
         * @for GameLoop
         */
        pause: function() {
            this.pause = true;
        },

        /**
         * 将游戏循环从运行状态设置为结束
         * @method end
         * @for GameLoop
         */
        end: function() {
            this.stop = true;
            window.clearTimeout(tid);
        }
    }

    this.GameLoop = GameLoop;
});

/**
 * 动画栅模块
 * 即一组图片组成的动画，可通过设置为循环播放一组动画帧
 * @module spriteSheet
 */
ezGame.register("spriteSheet", function(eg) {

    /**
     * 动画栅对象
     * @class SpriteSheet
     * @constructor
     * @param {String} id 这组动画栅的标识名
     * @param {Image|String} src 图片对象或者在loader中的标识名
     * @param {Object} options 动画栅的显示方式参数
     * @param {Number} options.x 动画栅在窗口上显示位置的y坐标
     * @param {Number} options.y 动画栅在窗口上显示位置的x坐标
     * @param {Number} options.beginX 选择图片的起始x坐标, 默认0
     * @param {Number} options.beginY 选择图片的起始y坐标, 默认0
     * @param {Array} options.frameSize 帧的width和height, 默认 [60,60]
     * @param {Number} options.frameTotal 帧的总数, 默认, 1
     * @param {Number} options.currentIndex 当前帧的索引, 默认 0
     * @param {Number} options.duration 动画栅切换帧的时间间隔单位ms, 默认100ms
     * @param {Boolean} options.isLoop 是否循环显示动画栅,默认false
     * @param {Function} callback 如果isLoop为false时，显示到最后一帧时调用callback
     * @return {SpriteSheet} 返回动画栅对象的实例的引用
     */
    var SpriteSheet = function(id, src, options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(src, options);
        }
        this.init(id, src, options);
    };

    SpriteSheet.prototype = {
        /**
         * 初始化对象的参数
         * @method init
         * @for SpriteSheet
         * @param {String} id 这组动画栅的标识名
         * @param {Image|String} src 图片对象或者在loader中的标识名
         * @param {Object} options 动画栅的显示方式参数
         * @param {Number} options.x 动画栅在窗口上显示位置的y坐标
         * @param {Number} options.y 动画栅在窗口上显示位置的x坐标
         * @param {Number} options.beginX 选择图片的起始x坐标, 默认0
         * @param {Number} options.beginY 选择图片的起始y坐标, 默认0
         * @param {Array} options.frameSize 帧的width和height, 默认 [60,60]
         * @param {Number} options.frameTotal 帧的总数, 默认, 1
         * @param {Number} options.currentIndex 当前帧的索引, 默认 0
         * @param {Number} options.duration 动画栅切换帧的时间间隔单位ms, 默认100ms
         * @param {Boolean} options.isLoop 是否循环显示动画栅,默认false
         * @param {Function} callback 如果isLoop为false时，显示到最后一帧时调用callback
         * @return {SpriteSheet} 返回动画栅对象的实例的引用
         */
        init: function(id, src, options) {
            var image = eg.loader.getImage(src);
            // 默认参数值
            var defaultOptions = {
                x: 0, // 目标图片在canvas上的位置
                y: 0,
                beginX: 0,
                beginY: 0,
                frameSize: [60, 60],
                frameTotal: 1,
                currentIndex: 0,
                duration: 100, // 单位：ms
                isLoop: false,
                callback: undefined
            };

            options = eg.utils.extend(defaultOptions, options);
            this.id = id;
            this.image = image;
            this.x = options.x;
            this.y = options.y;
            this.beginX = options.beginX;
            this.beginY = options.beginY;
            this.frameSize = options.frameSize;
            this.frameTotal = options.frameTotal;
            this.currentIndex = options.currentIndex;
            this.duration = options.duration;
            this.isLoop = options.isLoop;
            this.callback = options.callback;

            this.last = new Date().getTime();
            this.now = new Date().getTime();
        },

        /**
         * 显示下一帧
         * @method nextframe
         * @for SpriteSheet
         */
        nextFrame: function() {
            this.currentIndex = this.currentIndex < this.frameTotal - 1 ? this.currentIndex + 1 : 0;
        },

        /**
         * 更新动画栅的逻辑数据，为draw做准备
         * @method update
         * @for SpriteSheet
         */
        update: function() {
            if (this.isLoop) {
                this.now = new Date().getTime();
                if (this.now - this.last >= this.duration) {
                    this.last = this.now;
                    this.currentIndex = this.currentIndex < this.frameTotal - 1 ? this.currentIndex + 1 : 0;
                }
            }
        },

        /**
         * 在窗口中渲染出动画帧
         * @for SpriteSheet
         */
        draw: function() {
            try {
                eg.context.drawImage(
                    this.image,
                    this.frameSize[0] * this.currentIndex + this.beginX,
                    this.beginY,
                    this.frameSize[0],
                    this.frameSize[1],
                    this.x,
                    this.y,
                    this.frameSize[0],
                    this.frameSize[1]
                );
            } catch (e) {

            }
        }
    };

    this.SpriteSheet = SpriteSheet;
});


/**
 * 精灵模块
 * @module sprite
 */
ezGame.register("sprite", function(eg) {

    var postive_infinity = Number.POSITIVE_INFINITY;

    /**
     * 精灵对象
     * @class Sprite
     * @constructor
     * @param {Object} options 精灵对象的初始参数
     * @param {Number} options.x 精灵在窗口的初始位置的x坐标
     * @param {Number} options.y 精灵在窗口的初始位置的y坐标
     * @param {Number} options.imgX 如果精灵是以静态图片显示,图片的坐标x
     * @param {Number} options.imgY 如果图片的y坐标
     * @param {Number} options.width 精灵的实际宽度
     * @param {Number} options.height 精灵的实际高度
     * @param {Number} options.angle 精灵旋转角度
     * @param {Number} options.speedX 精灵在x坐标上的移动速度
     * @param {Number} options.speedY 精灵在y坐标上的移动速度
     * @param {Number} options.aX 精灵在x坐标上的加速度
     * @param {Number} options.aY 精灵在y坐标上的加速度
     * @param {Number} options.maxSpeedX 精灵在x坐标上的最大移动速度
     * @param {Number} options.maxSpeedY 精灵在y坐标上的最大移动速度
     * @param {Number} options.maxX 精灵在地图中的x坐标上的最远位置
     * @param {Number} options.maxY 精灵在地图中的y坐标上的最远位置
     * @param {Number} options.minX 精灵在地图中的x坐标上的最小位置
     * @param {Number} options.minY 精灵在地图中的y坐标上的最大位置
     * @return {Sprite} 返回Sprite的实例引用
     */
    var Sprite = function(options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(options);
        }
        this.init(options);
    }

    Sprite.prototype = {
        /**
         * Sprite对象实例初始化
         * @method init
         * @for Sprite
         * @param {Object} options 精灵对象的初始参数
         * @param {Number} options.x 精灵在窗口的初始位置的x坐标
         * @param {Number} options.y 精灵在窗口的初始位置的y坐标
         * @param {Number} options.imgX 如果精灵是以静态图片显示,图片的坐标x
         * @param {Number} options.imgY 如果图片的y坐标
         * @param {Number} options.width 精灵的实际宽度
         * @param {Number} options.height 精灵的实际高度
         * @param {Number} options.angle 精灵旋转角度
         * @param {Number} options.speedX 精灵在x坐标上的移动速度
         * @param {Number} options.speedY 精灵在y坐标上的移动速度
         * @param {Number} options.aX 精灵在x坐标上的加速度
         * @param {Number} options.aY 精灵在y坐标上的加速度
         * @param {Number} options.maxSpeedX 精灵在x坐标上的最大移动速度
         * @param {Number} options.maxSpeedY 精灵在y坐标上的最大移动速度
         * @param {Number} options.maxX 精灵在地图中的x坐标上的最远位置
         * @param {Number} options.maxY 精灵在地图中的y坐标上的最远位置
         * @param {Number} options.minX 精灵在地图中的x坐标上的最小位置
         * @param {Number} options.minY 精灵在地图中的y坐标上的最大位置
         * @return {Sprite} 返回Sprite的实例引用
         */
        init: function(options) {
            var defaultObj = {
                x: 0,
                y: 0,
                imgX: 0,
                imgY: 0,
                width: 32,
                height: 32,
                angle: 0,
                speedX: 0,
                speedY: 0,
                aX: 0,
                aY: 0,
                maxSpeedX: postive_infinity,
                maxSpeedY: postive_infinity,
                maxX: postive_infinity,
                maxY: postive_infinity,
                minX: -postive_infinity,
                minY: -postive_infinity
            };

            options = options || {};
            options = eg.utils.extend(defaultObj, options);

            this.x = options.x;
            this.y = options.y;
            this.angle = options.angle;
            this.width = options.width;
            this.height = options.height;
            this.angle = options.angle;
            this.speedX = options.speedX;
            this.speedY = options.speedY;
            this.aX = options.aX;
            this.aY = options.aY;
            this.maxSpeedX = options.maxSpeedX;
            this.maxSpeedY = options.maxSpeedY;
            this.maxX = options.maxX;
            this.maxY = options.maxY;
            this.minX = options.minX;
            this.minY = options.minY;

            this.spriteSheet = undefined;
            this.spriteSheetList = {};
            if (options.src) { //传入图片路径
                this.setCurrentImage(options.src, options.imgX, options.imgY);
            } else if (options.spriteSheet) { //传入spriteSheet对象
                this.addAnimation(options.spriteSheet);
                this.setCurrentAnimation(options.spriteSheet);
            }
        },

        /**
         * 返回包含该sprite的矩形对象
         * @method getRect
         * @for Sprite
         */
        getRect: function() {
            return new eg.shape.Rect({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            });
        },

        /**
         * 返回该sprite的position信息
         * @method getPosition
         * @for Sprite
         * @return {Object}
         */
        getPosition: function() {
            return {
                x: this.x,
                y: this.y
            };
        },

        /**
         * 设置sprite的位置
         * @method setPosition
         * @for Sprite
         * @param {Object} pos 目标位置
         * @param {int} pos.x 目标位置x坐标
         * @param {int} pos.y 目标位置y坐标
         * @return {Object} 返回当前对象的引用
         */
        setPosition: function(pos) {
            this.x = pos.x || this.x;
            this.y = pos.y || this.y;
            return this;
        },

        /**
         * 添加动画
         * @method addAnimation
         * @for Sprite
         * @param {SpriteSheet} spriteSheet 动画栅SpriteSheet对象
         */
        addAnimation: function(spriteSheet) {
            this.spriteSheetList[spriteSheet.id] = spriteSheet;
        },

        /**
         * 设置当前的显示动画
         * @method setCurrentAnimation
         * @for Sprite
         * @param {String|SpriteSheet} id 动画栅的标识名或者动画栅SpriteSheet对象
         */
        setCurrentAnimation: function(id) { //可传入id或spriteSheet
            if (!this.isCurrentAnimation(id)) {
                if (eg.utils.isString(id)) {
                    this.spriteSheet = this.spriteSheetList[id];
                    this.image = this.imgX = this.imgY = undefined;
                } else if (eg.utils.isObject(id)) {
                    this.spriteSheet = id;
                    this.addAnimation(id);
                    this.image = this.imgX = this.imgY = undefined;
                }
            }
        },

        /**
         * 判断当前动画是否为该id的动画
         * @method isCurrentAnimation
         * @for Sprite
         * @param {String|SpriteSheet} id 动画栅的标识名或者动画栅SpriteSheet对象
         */
        isCurrentAnimation: function(id) {
            if (eg.utils.isString(id)) {
                return (this.spriteSheet && this.spriteSheet.id === id);
            } else if (eg.utils.isObject(id)) {
                return this.spriteSheet === id;
            }
        },

        /**
         * 设置当前显示图像
         * @method setCurrentImage
         * @for Sprite
         * @param {String} name 图片在loader中标识名
         * @param {Number} imgX 目标图像在原图中的x坐标
         * @param {Number} imgY 目标图像在原图中y坐标
         */
        setCurrentImage: function(name, imgX, imgY) {
            if (!this.isCurrentImage(name, imgX, imgY)) {
                imgX = imgX || 0;
                imgY = imgY || 0;
                this.image = eg.loader.getImage(name);
                this.imgX = imgX;
                this.imgY = imgY;
                this.spriteSheet = undefined;
            }
        },

        /**
         * 判断当前图像是否为该图像
         * @method isCurrentImage
         * @for Sprite
         * @param {String} name 图片在loader中标识名
         * @param {Number} imgX 目标图像在原图中的x坐标
         * @param {Number} imgY 目标图像在原图中y坐标
         * @return {Boolean} 如果返回为当前图片，返回true，否则false
         **/
        isCurrentImage: function(name, imgX, imgY) {
            imgX = imgX || 0;
            imgY = imgY || 0;
            var currentImage = this.image;
            var image = eg.loader.getImage(name);
            return (currentImage && image.src === currentImage.src && this.imgX === imgX && this.imgY === imgY);
        },

        /**
         * 设置移动参数
         * @method setMovement
         * @for Sprite
         * @param {Object} options sprite的移动参数
         * @param {Number} options.speedX 精灵在x坐标上的移动速度
         * @param {Number} options.speedY 精灵在y坐标上的移动速度
         * @param {Number} options.aX 精灵在x坐标上的加速度
         * @param {Number} options.aY 精灵在y坐标上的加速度
         * @param {Number} options.maxSpeedX 精灵在x坐标上的最大移动速度
         * @param {Number} options.maxSpeedY 精灵在y坐标上的最大移动速度
         * @param {Number} options.maxX 精灵在地图中的x坐标上的最远位置
         * @param {Number} options.maxY 精灵在地图中的y坐标上的最远位置
         * @param {Number} options.minX 精灵在地图中的x坐标上的最小位置
         * @param {Number} options.minY 精灵在地图中的y坐标上的最大位置
         */
        setMovement: function(options) {
            isUndefined = eg.utils.isUndefined;
            isUndefined(options.speedX) ? this.speedX = this.speedX : this.speedX = options.speedX;
            isUndefined(options.speedY) ? this.speedY = this.speedY : this.speedY = options.speedY;

            isUndefined(options.aX) ? this.aX = this.aX : this.aX = options.aX;
            isUndefined(options.aY) ? this.aY = this.aY : this.aY = options.aY;
            isUndefined(options.maxX) ? this.maxX = this.maxX : this.maxX = options.maxX;
            isUndefined(options.maxY) ? this.maxY = this.maxY : this.maxY = options.maxY;
            isUndefined(options.minX) ? this.minX = this.minX : this.minX = options.minX;
            isUndefined(options.minY) ? this.minY = this.minY : this.minY = options.minY;

            if (this.aX != 0) {
                this.startTimeX = new Date().getTime();
                this.oriSpeedX = this.speedX;
                isUndefined(options.maxSpeedX) ? this.maxSpeedX = this.maxSpeedX : this.maxSpeedX = options.maxSpeedX;
            }
            if (this.aY != 0) {
                this.startTimeY = new Date().getTime();
                this.oriSpeedY = this.speedY;
                isUndefined(options.maxSpeedY) ? this.maxSpeedY = this.maxSpeedY : this.maxSpeedY = options.maxSpeedY;
            }
        },

        /**
         * 重置移动参数回到静止状态
         * @method resetMovement
         * @for Sprite
         */
        resetMovement: function() {
            this.speedX = 0;
            this.speedY = 0;
            this.aX = 0;
            this.aY = 0;
            this.maxSpeedX = postive_infinity;
            this.maxSpeedY = postive_infinity;
            this.maxX = postive_infinity;
            this.minX = -postive_infinity;
            this.maxY = postive_infinity;
            this.minY = -postive_infinity;
        },

        /**
         * 更新位置和帧动画
         * @method update
         * @for Sprite
         */
        update: function() {
            if (this.aX != 0) {
                var now = new Date().getTime();
                var durationX = now - this.startTimeX;
                var speedX = this.oriSpeedX + this.aX * durationX / 1000;
                if (this.maxSpeedX < 0) {
                    this.maxSpeedX *= -1;
                }
                if (speedX < 0) {
                    this.speedX = Math.max(speedX, this.maxSpeedX * -1);
                } else {
                    this.speedX = Math.min(speedX, this.maxSpeedX);
                }
            }

            if (this.aY != 0) {
                var now = new Date().getTime();
                var durationY = now - this.startTimeY;
                var speedY = this.oriSpeedY + this.aY * durationY / 1000;
                if (this.maxSpeedY < 0) {
                    this.maxSpeedY *= -1;
                }
                if (speedY < 0) {
                    this.speedY = Math.max(speedY, this.maxSpeedY * -1);
                } else {
                    this.speedY = Math.min(speedY, this.maxSpeedY);
                }
            }

            this.move(this.speedX, this.speedY);
            //更新spriteSheet动画
            if (this.spriteSheet) {
                this.spriteSheet.x = this.x;
                this.spriteSheet.y = this.y;
                this.spriteSheet.update();
            }
        },

        /**
         * 绘制出sprite
         * @method draw
         * @for Sprite
         */
        draw: function() {
            var context = eg.context;
            if (this.spriteSheet) {
                this.spriteSheet.draw();
            } else if (this.image) {
                context.drawImage(this.image, this.imgX, this.imgY, this.width, this.height, this.x, this.y, this.width, this.height);
            }
        },

        /**
         * 移动一定距离
         * @method move
         * @for Sprite
         * @param {Number} dx x方向上的增量
         * @param {Number} dy y方向上的增量
         * @return {Sprite} 返回this的引用
         */
        move: function(dx, dy) {
            dx = dx || 0;
            dy = dy || 0;
            var x = this.x + dx;
            var y = this.y + dy;
            this.x = Math.min(Math.max(this.minX, x), this.maxX);
            this.y = Math.min(Math.max(this.minY, y), this.maxY);
            return this;
        },

        /**
         * 移动到指定的位置
         * @method moveTo
         * @for Sprite
         * @param {Number} x x轴的位置
         * @param {Number} y y轴的位置
         * @return {Sprite} 返回this的引用
         */
        moveTo: function(x, y) {
            this.x = Math.min(Math.max(this.minX, x), this.maxX);
            this.y = Math.min(Math.max(this.minY, y), this.maxY);
            return this;
        },

        /**
         * 旋转一定角度
         * @method rotate
         * @for Sprite
         * @param {Number} da 旋转的增量
         * @return {Sprite} 返回this的引用
         */
        rotate: function(da) {
            this.angle += da;
            return this;
        },

        /**
         * 旋转到指定的角度
         * @method rotateTo
         * @for Sprite
         * @param {Number} a 旋转到指定的角度值
         * @return {Sprite} 返回this的引用
         */
        rotateTo: function(a) {
            this.angle = a;
            return this;

        },

        /**
         * 改变一定尺寸
         * @method resize
         * @for Sprite
         * @param {Number} dw width放大的增量
         * @param {Number} dh height放大的增量
         * @return {Sprite} 返回this的引用
         */
        resize: function(dw, dh) {
            this.width += dw;
            this.height += dh;
            return this;
        },

        /**
         * 改变到一定尺寸
         * @method resize
         * @for Sprite
         * @param {Number} width 宽的值
         * @param {Number} height 高的值
         * @return {Sprite} 返回this的引用
         */
        resizeTo: function(width, height) {
            this.width = width;
            this.height = height;
            return this;
        },

        /** 析构函数，删除该对象，释放内存
         * @method destroy
         * @for Sprite
         */
        destroy: function () {
            this.toDelete = true;
        }
    }

    this.Sprite = Sprite;
});

/**
 * 场景模块
 * @module scene
 */
ezGame.register("scene", function(eg) {
    /**
     * 场景对象
     * @class Scene
     * @constructor
     * @param {Object|string} image 场景的背景图片
     * @param {Object} options 可选参数
     * @param {number} options.width 显示窗口宽度
     * @param {number} options.height 显示窗口高度
     * @param {number} options.imgWidth 背景图片宽度
     * @param {number} options.imgHeight 背景图片高度
     * @param {number} options.x 背景图片可见的x坐标
     * @param {number} options.y 背景图片可见的y坐标
     * @param {number} options.centerX 被控制精灵可活动区间的中间位置
     * @param {number} options.activityInterval 被控制精灵可活动区间宽度的1/2
     * @param {boolean} options.isLoop 背景图片是否循环
     * @param {Function} options.onEnd 背景图片是不循环时滚动到终点的回调函数
     * return {Object} Scene的实例
     */
    var Scene = function(image, options) {
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(image, options);
        }
        this.init(image, options);
    };

    Scene.prototype = {
        /**
         * 初始化函数
         * @method init
         * @for Scene
         * @prama {Object|string} image 场景的背景图片
         * @prama {Object} options 可选参数
         * @param {number} options.width 显示窗口宽度
         * @param {number} options.height 显示窗口高度
         * @param {number} options.imgWidth 背景图片宽度
         * @param {number} options.imgHeight 背景图片高度
         * @param {number} options.x 背景图片可见的x坐标
         * @param {number} options.y 背景图片可见的y坐标
         * @param {number} options.centerX 被控制精灵可活动区间的中间位置
         * @param {number} options.activityInterval 被控制精灵可活动区间宽度的1/2
         * @param {boolean} options.isLoop 背景图片是否循环
         * @param {Function} options.onEnd 背景图片是不循环时滚动到终点的回调函数
         * return {Scene} 返回场景实例的引用
         */
        init: function(image, options) {

            this.image = eg.utils.isObject(image) ? image : eg.loader.loadedImgs[image];

            var defaultOptions = {
                width: eg.width,
                height: eg.height,
                imgWidth: this.image.width,
                imgHeight: this.image.height,
                x: 0,
                y: 0,
                centerX: eg.width / 2,
                activityInterval: 0,
                isLoop: false
            };

            options = options || {};
            options = eg.utils.extend(defaultOptions, options);

            this.width = options.width;
            this.height = options.height;
            this.imgWidth = options.imgWidth;
            this.imgHeight = options.imgHeight;
            this.x = options.x;
            this.y = options.y;
            this.centerX = options.centerX;
            this.activityInterval = options.activityInterval;
            this.isLoop = options.isLoop;
            this.isCenterPlayer = options.isCenterPlayer;
            this.onEnd = options.onEnd; // 到达滚动的右边时，回调函数

            // 场景相对最初始时的位置
            this.curPos = {
                x: this.x,
                y: this.y
            };
            this.spriteList = [];
        },

        /**
         * 设置被控制的精灵对象
         * @method setCenterPlayer
         * @for Scene
         * @param {Sprite} sprite 被控制的对象
         */
        setCenterPlayer: function(sprite) {
            this.player = sprite;
        },

        /**
         * 设置滚动开始
         * @method centerPlayer
         * @for Scene
         */
        centerPlayer: function() {
            this.isCenterPlayer = true;
        },

        /**
         * 清除滚动模式
         * @method clearCenterPlayer
         * @for Scene
         */
        clearCenterPlayer: function() {
            this.isCenterPlayer = false;
        },

        /**
         * 逻辑更新，调整场景参数及各个其他物体的位置
         * @method update
         * @for Scene
         */
        update: function(spriteList) {
            if (this.isCenterPlayer) {
                // 背景循环
                if (this.isLoop) {
                    // 背景左滚
                    if (this.player.x > this.centerX + this.activityInterval) {
                        var offsetX = this.player.x - this.centerX - this.activityInterval;
                        this.x += offsetX;
                        if (spriteList) {
                            for (var i = 0, len = spriteList.length; i < len; i++) {
                                if (this.player === spriteList[i]) continue;

                                spriteList[i].x -= offsetX;
                            }
                        }
                        this.curPos.x += offsetX;
                        this.player.x = this.centerX + this.activityInterval;

                        if (this.imgWidth < this.x + this.width) {
                            this.x = 0;
                        }
                    }
                    if (this.player.x < this.centerX - this.activityInterval) {
                        var offsetX = this.centerX - this.activityInterval - this.player.x;
                        this.x -= offsetX;
                        if (spriteList) {
                            for (var i = 0, len = spriteList.length; i < len; i++) {
                                if (this.player === spriteList[i]) continue;

                                spriteList[i].x += offsetX;
                            }
                        }
                        this.curPos.x -= offsetX;
                        this.player.x = this.centerX - this.activityInterval;

                        if (this.x < 0) {
                            this.x = this.imgWidth - this.width;
                        }
                    }
                }
                // 背景不循环
                else {
                    if (this.player.x > this.centerX + this.activityInterval) {
                        var offsetX = this.player.x - this.centerX - this.activityInterval;
                        this.x += offsetX;
                        this.curPos.x += offsetX;
                        this.player.x = this.centerX + this.activityInterval;
                    }
                    if (this.player.x < this.centerX - this.activityInterval) {
                        var offsetX = this.centerX - this.activityInterval - this.player.x;
                        this.x -= offsetX;
                        this.curPos.x -= offsetX;
                        this.player.x = this.centerX - this.activityInterval;
                    }
                    if (this.x + this.width >= this.imgWidth && this.onEnd) {
                        this.onEnd();
                    }
                }

            }
        },

        /**
         * 绘制场景
         * @method draw
         * @for Scene
         */
        draw: function() {
            try {
                eg.context.drawImage(this.image, this.x < 0 ? 0 : this.x, this.y < 0 ? 0 : this.y, this.width, this.height, 0, 0, this.width, this.height);
            } catch (e) {

            }
        }
    };
    this.Scene = Scene;
});
