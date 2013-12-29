/*
 * @name ezGame
 * @author huanghuiquan
 * @description A easy Javascript 2D game framework base HTML5. 
 */

(function (window, undefined){
    var document = window.document;
    var ezGame = {
        init: function (options){
            options = options || {};
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext('2d');

            this.size = options.size || [400,400];
            this.canvas.width = this.width = this.size[0];
            this.canvas.height = this.height = this.size[1];
            this.bgColor = options.bgColor || "#fff";
            this.bgImageSrc = options.bgImageSrc;
            this.fps = options.fps || 30;
            this.title = this.core.$('title')[0];

            //this.spriteList = new ezGame.SpriteList();

            this.canvas.style.width = this.width;
            this.canvas.style.height = this.height;
            this.canvas.style.backgroundColor = this.bgColor;
            this.canvas.style.backgroundImage = this.bgImageSrc;
            var wrap = options.wrap || "body";
            this.core.$(wrap)[0].appendChild(this.canvas); //将canvas 添加到网页中
            this.canvas.position = this.core.getElementPos(this.canvas);
            this.canvas.x = this.x = this.canvas.position.x;
            this.canvas.y = this.y = this.canvas.position.y;

            this.update = function () {};
            this.draw = function () {};

            return this;
        },
        
        register: function (nameSpace, func){
            var ns = nameSpace.split("."),
                parent = this;
            for(var i = 0; i < ns.length; i++) {
                parent[ns[i]] = parent[ns[i]] === undefined ? {} : parent[ns[i]];
                parent = parent[ns[i]];
            }
            if(func) {
                func.call(parent, this);
            }

        },

        _getCanvasPosition : function (){
            
        }

    };

    window["ezGame"] = ezGame;

})(window);

ezGame.register('core', function (eg){
    /* 
     * @description ezGame的选择器，返回选中的元素的集合
     * @param {String} id 选择器
     * @param {HTMLNode} parent 父元素，默认为document
     * @return {Array} 选中元素的集合
     */
    this.$ = function (id, parent) { 
        parent = parent || document;
        return parent.querySelectorAll(id);
    }
    
    /*
     * @description 事件绑定,兼容IE
     * @param elem 目标元素
     * @param type 事件类型
     * @param handler 需要绑定的事件函数
     */
    this.bindEvent = (function() {
        if (window.addEventListener) {
            return function(elem, type, handler) {
                elem.addEventListener(type, handler, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler) {
                elem.attachEvent("on" + type, handler);
            }
        }
    })();

    /* 
     * @description 事件解除
     * @param elem 目标元素
     * @param type 解除的事件类型
     * @param handler 解除事件的函数句柄
     */
    this.removeEvent = (function() {
        if (window.addEventListener) {
            return function(elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler) {
                elem.detachEvent("on" + type, handler);
            }
        }
    })();

    /* 
     * @description 获取事件对象
     * @param event 事件对象
     * @return 返回时间对象
     */
    this.getEventObj = function(event) {
        return event || window.event;
    };

    /* 
     * @description 获取事件目标对象
     * @param event 事件对象
     * @return 事件对象
     */
    this.getEventTarget = function(event) {
        var event = this.getEventObj(event);
        return event.target || event.srcElement;
    };

    /*
     * @description 禁止默认行为
     * @param event 事件对象
     * @return 无
     */
    this.preventDefault = function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }
    };

    /*
     * @destination 是否为undefined
     */
    this.isUndefined = function(elem) {
        return typeof elem === 'undefined';
    };

    /*
     * @destination 是否为数组
     */
    this.isArray = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Array]";
    };

    /* 
     * @destination 是否为Object类型
     */
    this.isObject = function(elem) {
        return elem === Object(elem);
    };

    /* 
     * @destination 是否为字符串类型
     */
    this.isString = function(elem) {
        return Object.prototype.toString.call(elem) === "[object String]";
    };
     
    /* 
     * @destination 是否为数值类型
     */
    this.isNum = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Number]";
    };

    /* 
     * @destination 是否为function
     */
    this.isFunction = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Function]";
    };

    /* 
     * @destination 复制对象属性
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

    /*
     * @description 计算对象属性的数量， 注意：不包含继承属性
     * @param obj Object 
     * @return int 除掉继承外的属性数量
     */
    this.count = function (obj) {
        var counter = 0;
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                counter ++ ;
            }
        }
        return counter;
    }

    /* 
     * 清除canvas
     */
    this.clearCanvas = function () {
        eg.context.clearRect(0, 0, eg.width, eg.height);
    }

    /* 
     * 获取元素在页面中的位置
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
        return {x: left, y: top};
    }
});

/* 
 * @description 资源加载器
 **/
ezGame.register("loader",function(eg){
    /* 
     * @description 开始加载资源
     * @param items object 资源列表
     * @param gameObj object 游戏对象
     * @param callbackforsuccess(gameObj, loader) function 加载成功是调用
     * @param callbackforfail(gameObj, loader) function 加载失败时调用
     * @param timeout number 预设最长加载时间，如果，超过时间则设置为加载失败
     */
    this.start = function( items, gameObj, callbackForSuccess, callbackForFail, timeout) {
        this.total = eg.core.count(items);
        this.loadedCount = 0;    // 图片已加载数
        this.loadedPercent = 0;  // 图片已加载数
        this.loadingImgs = {};   // 未加载图片集合
        this.loadedImgs  = {};   // 已加载图片集合
        this.loadFailImgs  = {}; // 加载失败的图片集
        for(var item in items){
            this.loadingImgs[item]=new Image();
            this.loadingImgs[item].src = items[item];
            this.loadingImgs[item].onload = (function (that, name) {
                return function () {
                    that.loadedCount++;
                    that.loadedImgs[name] = that.loadingImgs[name];
                    that.loadedPercent = Math.floor( that.loadedCount / that.total * 100 );

                    if (that.total === that.loadedCount) {
                        clearTimeout(sid);
                        callbackForSuccess(gameObj, that);
                    }
                }
            })(this, item);
        }

        var timeout = timeout || 30000;
        var sid = setTimeout((function (that) {
            return function () {
                if (that.loadedCount !== that.total) {
                    for (var i in that.loadingImgs) {
                        if ( !(i in that.loadedImgs) ) {
                            that.loadFailImgs[i] = that.loadingImgs[i].src;
                        }
                    }
                    if ((typeof callbackForFail) !== "undefined") {
                        callbackForFail(gameObj, that);
                    }
                }
            };
        })(this), timeout);
    }
});


/* 
 * 图形模块
 * 包含点、矩形、圆、文本对象
 */
ezGame.register("shape",function(eg){

    /*
     * @destination 更新right和bottom
     * @private
     * @prama {Shape} elem 图形对象
     */ 
    var _resetRightBottom = function(elem){
        elem.right = elem.x + elem.width;
        elem.bottom = elem.y + elem.height; 
    }

    /*
     * @description 矩形对象
     * @param {Object} options 默认为{x : 0, y : 0, width : 100, height ： 100, style : "red", isFill : true}
     * @return {Rect} 
     */                                     
    var Rect = function( options ) {
        // 如果以ezGame.rect(options) 形式调用则return new rect(options)，避免直接调用函数
        if( !(this instanceof arguments.callee) ) {
            return new arguments.callee(options);
        }
        this.init(options);
    };
    Rect.prototype = {
        init : function(options) {
            var defaultOptions = {
                x : 0,
                y : 0,
                width : 100,
                height : 100,
                style : "red",
                isFill : true
            };
            options = options || {};
            options = eg.core.extend( defaultOptions, options );
            this.setOptions( options );

            _resetRightBottom(this);
        },

        /* 
         * 设置参数
         * @prama {Object} options 
         * @returns {Rect} 
         */
        setOptions : function(options){
            this.x = eg.core.isNum(options.x) ? options.x : this.x;
            this.y = eg.core.isNum(options.y) ? options.y : this.y;
            this.width = eg.core.isNum(options.width) ? options.width : this.width;
            this.height = eg.core.isNum(options.height) ? options.height : this.height;
            this.style = options.style || this.style;
            this.isFill = eg.core.isUndefined(options.isFill) ? this.isFill : options.isFill;
            return this;
        },

        /*
         * 绘制矩形
         * @returns {Rect} 
         */ 
        draw : function() {
            var context = eg.context;
            if( this.isFill ) {
                context.fillStyle = this.style;
                context.fillRect(this.x, this.y, this.width, this.height);
            }
            else {
                context.strokeStyle = this.style;
                context.strokeRect(this.x, this.y, this.width, this.height);
            }
            return this;
        },

        /*
         * 将矩形移动一定距离
         * @param {Num} dx x轴上的增量
         * @param {Num} dy y轴上的增量
         * @returns {Rect} 
         */ 
        move : function(dx, dy){
            dx = dx || 0;
            dy = dy || 0;
            this.x += dx;
            this.y += dy;

            _resetRightBottom(this);
            return this;
        },

        /*
         * 将矩形移动到特定位置
         * @param {Num} x x轴位置
         * @param {Num} y y轴位置
         * @returns {Rect} 
         */ 
        moveTo : function(x, y){
            x = eg.core.isNum(x) ? x : this.x;
            y = eg.core.isNum(y) ? y : this.y;
            this.x = x;
            this.y = y;
            _resetRightBottom(this);
            return this;
        },

        /*
         * 将矩形放大或者缩小
         * @param {Num} w 宽度的增量
         * @param {Num} h 高度的增量
         * @returns {Rect} 
         */ 
        resize : function(w, h){
            w = w || 0;
            h = h || 0;
            this.width += w;
            this.height += h;
            _resetRightBottom(this);
            return this;
        },

        /*
         * 将矩形改变到特定大小
         * @param {Num} width 宽度
         * @param {Num} height 高度
         * @returns {Rect} 
         */ 
        resizeTo : function(width, height){
            width = width || this.width;
            height = height || this.height;
            this.width = width;
            this.height = height;
            _resetRightBottom(this);
            return this;
        }
    }

    /*
     * 圆形对象
     * @param {Object} options 默认参数 
     *      { x : 100, y : 100, r : 100, startAngle : 0, endAngle : Math.PI * 2, antiClock : false, style : "red", isFill : true}
     * @returns {Circle} 
     */     
    var Circle = function(options){
        if(!(this instanceof arguments.callee)){
            return new arguments.callee(options);
        }
        this.init(options);
    }
    Circle.prototype = {
        init : function(options){
            //默认参数
            var defaultOptions = {
                x : 100,
                y : 100,
                r : 100,
                startAngle : 0,
                endAngle : Math.PI * 2,
                antiClock : false, //逆时针
                style : "red",
                isFill : true
            };
            options = options || {};
            options = eg.core.extend(defaultOptions, options);
            this.setOptions(options);
        },
        
        /*
         * 设置参数
         * @param {Object} options 参数表, 默认使用原来的参数
         * @returns {Circle}
         */
        setOptions : function(options) {
            this.x = eg.core.isNum(options.x) ? options.x : this.x;
            this.y = eg.core.isNum(options.y) ? options.y : this.y;
            this.r = eg.core.isNum(options.r) ? options.r : this.r;
            this.startAngle = eg.core.isNum(options.startAngle) ? options.startAngle : this.startAngle;
            this.endAngle = eg.core.isNum(options.endAngle) ? options.endAngle : this.endAngle;
            this.antiClock = eg.core.isUndefined(options.antiClock) ? this.antiClock : options.antiClock;
            this.style = options.style || this.style;
            this.isFill = eg.core.isUndefined(options.isFill) ? this.isFill : options.isFill;
            return this;
        },
        
        /*
         * 绘制圆形
         * @returns {Circle}
         */
        draw : function(){
            var context = eg.context;
            context.beginPath();
            context.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, this.antiClock);
            if(this.isFill){
                context.fillStyle = this.style;
                context.fill();
            }
            else{
                context.strokeStyle = this.style;
                context.stroke();
            }
            context.closePath();
            return this;
        },

        /*
         * 将圆形移动一定距离
         * @param {Num} dx x轴上的增量
         * @param {Num} dy y轴上的增量
         * @returns {Circle} 
         */ 
        move : function(dx, dy){
            dx = dx || 0;
            dy = dy || 0;
            this.x += dx;
            this.y += dy;
            return this;
        },

        /*
         * 将圆形移动到特定位置
         * @param {Num} x x轴位置
         * @param {Num} y y轴位置
         * @returns {Circle} 
         */ 
        moveTo : function(x, y){
            x = eg.core.isNum(x) ? x : this.x;
            y = eg.core.isNum(y) ? y : this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        /*
         * 放大或者缩小圆形
         * @param {Num} dr 半径增量
         * return {Circle}
         */ 
        resize : function(dr){
            dr = dr || 0;
            this.r += dr;
            return this;
        },

        /*
         * 将圆形改变到特定大小
         * @param {Num} r 半径
         * @return {Circle}
         */ 
        resizeTo : function(r){
            r = eg.core.isNum(r) ? r :  this.r;
            this.r = r;
            return this;
        }   
    }

    /* 
     * 点
     */
    var Point = function (x, y) {
        if( !(this instanceof arguments.callee) ) {
            return new arguments.callee(x,y);
        }
        return new this.init({x:x, y:y, r:1});
    }
    Point.prototype = Circle.prototype;

    var Text = function(text, options){
        if(!(this instanceof arguments.callee)){
            return new arguments.callee(text, options);
        }
        this.init(text,options);
    }
    Text.prototype={
        init:function(text,options){
            // 默认值对象
            var defaultOptions={
                x:100,
                y:100,
                style:"red",
                isFill:true
            };

            options = options || {};
            options = eg.core.extend(defaultOptions, options);
            this.setOptions(options);
            this.text = text;     
        },

        /* 
         * 设置参数
         * @param {Object} options 
         * @return {Text} 
         */
        setOptions:function(options){
            this.x = options.x||this.x;
            this.y = options.y||this.y;
            this.maxWidth = options.maxWidth || this.maxWidth;
            this.font = options.font || this.font;
            this.textBaseline = options.textBaseline || this.textBaseline;
            this.textAlign = options.textAlign || this.textAlign;
            this.isFill = options.isFill || this.isFill;
            this.style = options.style || this.style;
            return this;
        },

        /* 
         * 将文字渲染到canvas
         * return {Text} 
         */
        draw : function(){
            var context = eg.context;
            (!eg.core.isUndefined(this.font)) && (context.font = this.font);
            (!eg.core.isUndefined(this.textBaseline)) && (context.textBaseline = this.textBaseline);
            (!eg.core.isUndefined(this.textAlign)) && (context.textAlign = this.textAlign);
            (!eg.core.isUndefined(this.maxWidth)) && (context.maxWidth = this.maxWidth);
            if(this.isFill){
                context.fillStyle = this.style;
                this.maxWidth ? context.fillText(this.text, this.x, this.y, this.maxWidth) : context.fillText(this.text, this.x, this.y);
            }
            else{
                context.strokeStyle = this.style;
                this.maxWidth ? context.strokeText(this.text, this.x, this.y, this.maxWidth) : context.strokeText(this.text, this.x, this.y);
            }
            return this;
        },
    }

    this.isPoint = function (shape) {
        return shape instanceof Point;
    }

    this.isRect = function (shape) {
        return shape instanceof Rect;
    }

    this.isCircle = function (shape) {
        return shape instanceof Circle;
    }

    this.isText = function (shape) {
        return shape instanceof Text;
    }

    this.Point =Point;
    this.Rect = Rect;
    this.Circle = Circle;
    this.Text = Text;
});


/*
 * 输入模块
 * 按键重命名、按键事件绑定
 * input module
 */
ezGame.register("input",function(eg){
    this.mouseX = 0;
    this.mouseY = 0;

    var recordMouseMove = function(eve){
        var pageX,
            pageY,
            x,
            y;
        eve = eg.core.getEventObj(eve);
        pageX = eve.pageX || eve.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        pageY = eve.pageY || eve.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
        eg.input.mouseX = pageX - eg.canvas.x;
        eg.input.mouseY = pageY - eg.canvas.y;
    };      
    eg.core.bindEvent(window, "mousemove", recordMouseMove);

    // 被按下的键的集合
    var pressed_keys={};
    // 要求禁止默认行为的键的集合
    var preventDefault_keys={};
    // 键盘按下触发的处理函数
    var keydown_callbacks={};
    // 键盘弹起触发的处理函数
    var keyup_callbacks = {};

    // 键盘编码映射
    var k=[];
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
    k[40] = "down" ;
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

    var numpadkeys = ["numpad1","numpad2","numpad3","numpad4","numpad5","numpad6","numpad7","numpad8","numpad9"];
    var fkeys = ["f1","f2","f3","f4","f5","f6","f7","f8","f9"];
    var numbers = ["0","1","2","3","4","5","6","7","8","9"];
    var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    for(var i = 0; numbers[i]; i++) { k[48+i] = numbers[i] }
    for(var i = 0; letters[i]; i++) { k[65+i] = letters[i] }
    for(var i = 0; numpadkeys[i]; i++) { k[96+i] = numpadkeys[i] }
    for(var i = 0; fkeys[i]; i++) { k[112+i] = fkeys[i] }
    
    /* 
     * 记录键盘按下的键,并运行注册在该事件上的函数
     */
    var recordPress = function(eve){
        eve = eg.core.getEventObj(eve);
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = true; 
        if(keydown_callbacks[keyName]){
            for(var i = 0, len = keydown_callbacks[keyName].length; i < len; i++){
                keydown_callbacks[keyName][i]();
            }
        }
        if(keydown_callbacks["allKeys"]){
            for(var i=0, len = keydown_callbacks["allKeys"].length; i < len; i++){
                keydown_callbacks["allKeys"][i]();
            }
        }
        if(preventDefault_keys[keyName]){
            eg.core.preventDefault(eve);
        }
    }

    /*
     * 记录键盘松开的键,并运行注册在该事件上的函数 
     */ 
    var recordUp = function(eve){
        eve = eg.core.getEventObj(eve);
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = false;
        if(keyup_callbacks[keyName]){
            for(var i = 0, len = keyup_callbacks[keyName].length; i < len; i++){
                keyup_callbacks[keyName][i]();
            }   
        }
        if(keyup_callbacks["allKeys"]){
            for(var i = 0, len = keyup_callbacks["allKeys"].length; i < len; i++){
                keyup_callbacks["allKeys"][i]();
            }
        }
        if(preventDefault_keys[keyName]){
            eg.core.preventDefault(eve);
        }
    }
    eg.core.bindEvent(window,"keydown",recordPress);
    eg.core.bindEvent(window,"keyup",recordUp);

    /*
     * 判断某个键是否按下
     */ 
    this.isPressed = function(keyName){
        return !!pressed_keys[keyName]; 
    };

    /*
     * 禁止某个键按下的默认行为
     * @param {Array | String} keyName 要禁止默认行为的按键
     */ 
    this.preventDefault = function(keyName){
        if(eg.core.isArray(keyName)){
            for(var i = 0, len = keyName.length; i < len; i++){
                arguments.callee.call(this, keyName[i]);
            }
        }
        else{
            preventDefault_keys[keyName]=true;
        }
    }

    /*
     * 绑定键盘按下事件, 可绑定多个事件
     * @param {String} keyName 按键名字
     * @param {Function} handler 事件函数
     */ 
    this.onKeyDown = function(keyName, handler){
        keyName = keyName || "allKeys";
        if(eg.core.isUndefined(keydown_callbacks[keyName])){
            keydown_callbacks[keyName] = [];                          
        }
        keydown_callbacks[keyName].push(handler);
    }

    /*
     * 绑定键盘弹起事件, 可绑定多个事件
     * @param {String} keyName 按键名字
     * @param {Function} handler 事件函数
     */ 
    this.onKeyUp=function(keyName,handler){
        keyName = keyName || "allKeys";
        if(eg.core.isUndefined(keyup_callbacks[keyName])){
            keyup_callbacks[keyName] = [];                            
        }
        keyup_callbacks[keyName].push(handler);
    }

    /*
     * 清除键盘按下事件处理程序
     * @param {String} keyName 按键名，为空时清除所有按键按下事件
     */ 
    this.clearDownCallbacks = function(keyName){
        if(keyName){
            keydown_callbacks[keyName]=[];
        }
        else{
            keydown_callbacks = {};
        }
    }

    /*
     * 清除键盘按键松开事件处理程序
     * @param {String} keyName 按键名，为空时清除所有按键松开事件
     */ 
    this.clearUpCallbacks = function(keyName){
        if(keyName){
            keyup_callbacks[keyName] = [];
        }
        else{
            keyup_callbacks = {};
        }
    }                                           
});

/*
 * 碰撞检测
 */
ezGame.register("collision",function(eg){
    var shape = eg.shape;
    var pow = Math.pow;
    this.detection = function (objectA, objectB) {
        // 点和点
        if (shape.isPoint(objectA) && shape.isPoint(objectB)){
            return objectA.x === objectB.x && objectA.y === objectB;
        } 

        // 点和矩形间的碰撞
        if (shape.isPoint(objectA) && shape.isRect(objectB)) {
            return (objectA.x >= objectB.x && objectA.x <= objectB.right && objectA.y >= objectB.y && objectA.y <= objectB.bottom);       
        }
        if (shape.isRect(objectA) && shape.isPoint(objectB)) {
            return this.detection(objectB, objectA);
        }

        // 点和圆的碰撞
        if (shape.isPoint(objectA) && shape.isCircle(objectB)) {
            return (pow(objectA.x - objectB.x, 2) + pow(objectA.y - objectB.y, 2) <= pow(objectB.r, 2));
        }
        if (shape.isCircle(objectA) && shape.isPoint(objectB)) {
            return this.detection(objectB, objectA);
        }

        // 圆 和 矩形 的碰撞
        if (shape.isCircle(objectA) && shape.isRect(objectB)) {
            return (objectA.x + objectA.r >= objectB.x && objectA.x - objectA.r <= objectB.right && objectA.y + objectA.r >= objectB.y && objectA.y - objectA.r <= objectB.bottom);       
        }
        if (shape.isRect(objectA) && shape.isCircle(objectB)) {
            return this.detection(objectB, objectA);
        }

        // 矩形和矩形的碰撞 限制：只能是两个矩形都是平行的
        if (shape.isRect(objectA) && shape.isRect(objectB)) {
            return ((objectA.right >= objectB.x && objectA.right <= objectB.right || objectA.x >= objectB.x && objectA.x < objectB.right) && (objectA.bottom > objectB.y && objectA.bottom < objectB.bottom || objectA.y < objectB.bottom && objectA.bottom > objectB.y));       
        }

        // 圆和圆的碰撞
        if (shape.isCircle(objectA) && shape.isCircle(objectB)) {
            return (pow(objectA.x - objectB.x, 2) + pow(objectA.y - objectB.y, 2) <= pow(objectB.r + objectA.r, 2));
        }
        return fasle;
    }
});

/* 
 * 游戏循环模块
 */
ezGame.register("loop",function(eg){
    var tid, interval;
        
    var loop = function() {
        var _this = this;
        return function () {
            if(!_this.pause && !_this.stop){

                _this.now = new Date().getTime();
                _this.duration = _this.startTime - _this.now;

                if(_this.gameObj.update){
                    _this.gameObj.update();
                }

                if(_this.gameObj.draw){
                    eg.core.clearCanvas();
                    _this.gameObj.draw();
                }
            }
            tid = window.setTimeout(arguments.callee,interval);
        }
    }

    var GameLoop = function(gameObj, options){
        if(!(this instanceof arguments.callee)) {
            return new arguments.callee(gameObj, options);
        }
        this.init(gameObj,options); 
    }
    GameLoop.prototype = {
        init: function(gameObj, options){
            var defaultOptions = {
                fps:60
            };
            options = options || {};

            options = eg.core.extend(defaultOptions, options);
            this.gameObj = gameObj;
            this.fps = options.fps;
            interval = 1000 / this.fps;

            this.pause = false;
            this.stop = true;
        },

        start : function(){
            if(this.stop){      //如果是结束状态则可以开始
                this.stop = false;
                this.now = new Date().getTime();
                this.startTime = new Date().getTime();
                this.duration = 0;    
                loop.call(this)();  
            }   
        },

        run : function(){
            this.pause = false;   
        },
        
        pause : function(){
            this.pause = true;    
        },

        end : function(){
            this.stop = true;
            window.clearTimeout(timeId);
        }
    }
    this.GameLoop = GameLoop;
});



/*
 * 精灵模块
 */
ezGame.register("sprite",function(eg){

    var postive_infinity = Number.POSITIVE_INFINITY;          

    var SpriteSheet = function (src, options) {
        if(!(this instanceof arguments.callee)){
            return new arguments.callee(src, options);
        }
        this.init(src, options);
    };

    SpriteSheet.prototype = {
        init : function (image, options) {
            // 默认为图片的高度/宽度
            var defaultOptions = {
                x : 0,
                y : 0,
                widht : eg.loader.loadedImgs[image].width, 
                height : eg.loader.loadedImgs[image].height
            };
            options = eg.core.extend(defaultOptions, options);
            this.image = image;
            this.x = options.x;
            this.y = options.y;
            this.width = options.width;
            this.height = options.height;
            this.id = new Date().getTime();
        },
    };

    var Sprite = function(id, options) {
        if(!(this instanceof arguments.callee)){
            return new arguments.callee(id, options);
        }
        this.init(id, options);
    }

    Sprite.prototype = {
        init : function(options){
            var defaultObj = {
                x         : 0,
                y         : 0,
                imgX      : 0,
                imgY      : 0,
                width     : 32,
                height    : 32,
                angle     : 0,
                speedX    : 0,
                speedY    : 0,
                aX        : 0,
                aY        : 0,
                maxSpeedX : postive_infinity,
                maxSpeedY : postive_infinity,
                maxX      : postive_infinity,
                maxY      : postive_infinity,
                minX      : -postive_infinity,
                minY      : -postive_infinity
            };

            options = options || {};
            options = eg.core.extend(defaultObj, options);

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

            this.spriteSheetList = {};
            if(options.src){    //传入图片路径
                this.setCurrentImage(options.src, options.imgX, options.imgY);
            }
            else if(options.spriteSheet){//传入spriteSheet对象
                this.addAnimation(options.spriteSheet);     
                setCurrentAnimation(options.spriteSheet);
            }
        },

        /**
         *返回包含该sprite的矩形对象
         **/
        getRect : function(){
            return new eg.shape.Rect({x: this.x, y: this.y, width: this.width, height: this.height});
        },

        /*
         * 添加动画
         */
        addAnimation : function(spriteSheet){
            this.spriteSheetList[spriteSheet.id] = spriteSheet;   
        },

        /*
         * 设置当前显示动画
         */
        setCurrentAnimation : function(id) {    //可传入id或spriteSheet
            if(!this.isCurrentAnimation(id)) {
                if(eg.core.isString(id)){
                    this.spriteSheet = this.spriteSheetList[id];
                    this.image = this.imgX = this.imgY = undefined;
                }
                else if(cg.core.isObject(id)){
                    this.spriteSheet=id;
                    this.addAnimation(id);
                    this.image=this.imgX=this.imgY=undefined;
                }
            }

        },

        /*
         * 判断当前动画是否为该id的动画
         */
        isCurrentAnimation:function(id){
            if(cg.core.isString(id)){
                return (this.spriteSheet&&this.spriteSheet.id===id);
            }
            else if(cg.core.isObject(id)){
                return this.spriteSheet===id;
            }
        },

        /*
         * 设置当前显示图像
         */
        setCurrentImage : function(src,imgX,imgY){
            if(!this.isCurrentImage(src,imgX,imgY)){
                imgX=imgX||0;
                imgY=imgY||0;
                this.image=eg.loader.loadedImgs[src];   
                this.imgX=imgX;
                this.imgY=imgY; 
                this.spriteSheet = undefined;
            }
        },

        /**
         * 判断当前图像是否为该src的图像
         **/
        isCurrentImage : function(src,imgX,imgY){
            imgX=imgX||0;
            imgY=imgY||0;
            var image=this.image;
            if(eg.core.isString(src)){
                return (image&&image.srcPath===src&&this.imgX===imgX&&this.imgY===imgY);
            }
        },

        /*
         * 设置移动参数
         */
        setMovement : function(options){
            isUndefined=cg.core.isUndefined;
            isUndefined(options.speedX)?this.speedX=this.speedX:this.speedX=options.speedX;
            isUndefined(options.speedY)?this.speedY=this.speedY:this.speedY=options.speedY;

            isUndefined(options.aX)?this.aX=this.aX:this.aX=options.aX;
            isUndefined(options.aY)?this.aY=this.aY:this.aY=options.aY;
            isUndefined(options.maxX)?this.maxX=this.maxX:this.maxX=options.maxX;
            isUndefined(options.maxY)?this.maxY=this.maxY:this.maxY=options.maxY;
            isUndefined(options.minX)?this.minX=this.minX:this.minX=options.minX;
            isUndefined(options.minY)?this.minY=this.minY:this.minY=options.minY;

            if(this.aX!=0){
                this.startTimeX=new Date().getTime();
                this.oriSpeedX=this.speedX;
                isUndefined(options.maxSpeedX)?this.maxSpeedX=this.maxSpeedX:this.maxSpeedX=options.maxSpeedX;  
            }
            if(this.aY!=0){
                this.startTimeY=new Date().getTime();
                this.oriSpeedY=this.speedY;
                isUndefined(options.maxSpeedY)?this.maxSpeedY=this.maxSpeedY:this.maxSpeedY=options.maxSpeedY;  
            }

        },

        /*
         * 重置移动参数回到初始值
         */
        resetMovement : function(){
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

        /*
         * 更新位置和帧动画
         */
        update : function(){
            if(this.aX != 0){
                var now = new Date().getTime();
                var durationX = now - this.startTimeX;
                var speedX = this.oriSpeedX + this.aX * durationX / 1000;
                if(this.maxSpeedX < 0){
                    this.maxSpeedX *= -1;
                }
                if(speedX < 0){
                    this.speedX = Math.max(speedX, this.maxSpeedX * -1)  ;
                }
                else{
                    this.speedX=Math.min(speedX,this.maxSpeedX);
                }
            }
             
            if(this.aY != 0){
                var now = new Date().getTime();
                var durationY = now - this.startTimeY;
                this.speedY = this.oriSpeedY + this.aY * durationY / 1000;  
            }

            this.move(this.speedX, this.speedY);

            if(this.spriteSheet) {   //更新spriteSheet动画
                this.spriteSheet.x = this.x;
                this.spriteSheet.y = this.y;
                this.spriteSheet.update();
            }
        },

        /*
         * 绘制出sprite
         */
        draw : function(){
            if(this.spriteSheet){
                this.spriteSheet.draw();
            }
        },

        /*
         * 移动一定距离
         */
        move : function(dx, dy){
            dx = dx || 0;
            dy = dy || 0;
            var x = this.x+dx;
            var y = this.y+dy;
            this.x = Math.min(Math.max(this.minX,x), this.maxX);
            this.y = Math.min(Math.max(this.minY,y), this.maxY);
            return this;
        },

        /*
         * 移动到某处
         */
        moveTo: function(x, y){
            this.x = Math.min(Math.max(this.minX, x), this.maxX);
            this.y = Math.min(Math.max(this.minY, y), this.maxY);
            return this;
        },

        /*
         * 旋转一定角度
         */
        rotate : function(da){
            this.angle += da;
            return this;
        },

        /*
         * 旋转到一定角度
         */
        rotateTo : function(a){
            this.angle = a;
            return this;

        },

        /*
         * 改变一定尺寸
         */
        resize : function(dw,dh){
            this.width += dw;
            this.height += dh;
            return this;
        },

        /*
         * 改变到一定尺寸
         */
        resizeTo : function(width, height){
            this.width = width;
            this.height = height;
            return this;
        }
    }
    this.Sprite = Sprite;                           
});

