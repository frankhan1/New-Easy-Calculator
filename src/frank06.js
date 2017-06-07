var frank06Layer = cc.Layer.extend({
    sprite: null,
    nums: new Array(10),
    rects: new Array(10),
    plus: null,
    minus: null,
    multiply: null,
    divide: null,
    equal: null,
    cancel: null,
    output: null,
    input: null,
    ok1: 0,
    ok2: 0,
    inputString: ' ',
    outputString: ' ',
    num: 0.00,

    ctor: function () {
        this._super();
        var size = cc.winSize;
        var myTitle = new cc.LabelTTF("簡易型計算器", "Arial", 48);
        myTitle.x = size.width / 2;
        myTitle.y = size.height * 9 / 10;
        myTitle.setColor(cc.color(255, 255, 0));
        this.addChild(myTitle, 0, "myTitle");

        var colorInput = new cc.LayerColor(
            cc.color(255, 255, 255),
            500, 76);
        colorInput.x = size.width / 2;
        colorInput.y = size.height * 5 / 8;
        colorInput.ignoreAnchorPointForPosition(false);
        this.addChild(colorInput, 0);

        var colorOutput = new cc.LayerColor(
            cc.color(255, 255, 255),
            500, 76);
        colorOutput.x = size.width / 2;
        colorOutput.y = size.height * 6 / 8;
        colorOutput.ignoreAnchorPointForPosition(false);
        this.addChild(colorOutput, 0);

        this.initSprite();
        this.myMouseListener(this);
        this.scheduleUpdate();
        return true;
    },

    initSprite: function () {
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.caculator_plist, res.caculator_png);
        for (i = 0; i < this.nums.length; i++) {
            this.nums[i] = new cc.Sprite("#number_" + i + ".png");
            var px, py;
            if (i == 0) {
                px = 2;
                py = 1;
            } else {
                px = (i - 1) % 3 + 2;
                py = parseInt((i - 1) / 3) + 2;
            }

            this.nums[i].attr({
                x: cc.winSize.width * px / 7,
                y: cc.winSize.height * py / 8
            });
            this.addChild(this.nums[i]);

            this.rects[i] = new cc.Rect(
                this.nums[i].x - this.nums[i].width / 2,
                this.nums[i].y - this.nums[i].height / 2,
                this.nums[i].width,
                this.nums[i].height
            );
        }

        this.cancel = new cc.Sprite("#cancel.png");
        this.cancel.attr({
            x: cc.winSize.width * 3 / 7,
            y: cc.winSize.height / 8
        });
        this.addChild(this.cancel);

        this.equal = new cc.Sprite("#equal.png");
        this.equal.attr({
            x: cc.winSize.width * 4 / 7,
            y: cc.winSize.height / 8
        });
        this.addChild(this.equal);

        this.plus = new cc.Sprite("#plus.png");
        this.plus.attr({
            x: cc.winSize.width * 5 / 7,
            y: cc.winSize.height * 4 / 8
        });
        this.addChild(this.plus);

        this.minus = new cc.Sprite("#minus.png");
        this.minus.attr({
            x: cc.winSize.width * 5 / 7,
            y: cc.winSize.height * 3 / 8
        });
        this.addChild(this.minus);

        this.multiply = new cc.Sprite("#multiply.png");
        this.multiply.attr({
            x: cc.winSize.width * 5 / 7,
            y: cc.winSize.height * 2 / 8
        });
        this.addChild(this.multiply);

        this.divide = new cc.Sprite("#divide.png");
        this.divide.attr({
            x: cc.winSize.width * 5 / 7,
            y: cc.winSize.height / 8
        });
        this.addChild(this.divide);

        this.input = new cc.LabelTTF("", "", 48);
        this.input.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height * 5 / 8
        });
        this.addChild(this.input);

        this.output = new cc.LabelTTF("", "", 48);
        this.output.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height * 6 / 8
        });
        this.addChild(this.output);
    },

    myMouseListener: function (layer) {
        if ('mouse' in cc.sys.capabilities) {
            var mouseListener = {
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var x = event.getLocationX();
                    var y = event.getLocationY();
                    var point = new cc.Point(x, y);

                    var rect1 = new cc.Rect(
                        layer.plus.x - layer.plus.width / 2,
                        layer.plus.y - layer.plus.height / 2,
                        layer.plus.width,
                        layer.plus.height
                    );

                    if (cc.rectContainsPoint(rect1, point)) {
                        layer.ok1 = 1;   // "plus key be pressed"
                    }

                    var rect2 = new cc.Rect(
                        layer.minus.x - layer.minus.width / 2,
                        layer.minus.y - layer.minus.height / 2,
                        layer.minus.width,
                        layer.minus.height
                    );

                    if (cc.rectContainsPoint(rect2, point)) {
                        layer.ok1 = 2;   // "minus key be pressed"
                    }
                    var rect3 = new cc.Rect(
                        layer.multiply.x - layer.multiply.width / 2,
                        layer.multiply.y - layer.multiply.height / 2,
                        layer.multiply.width,
                        layer.multiply.height
                    );

                    if (cc.rectContainsPoint(rect3, point)) {
                        layer.ok1 = 3;   // "multiply key be pressed"
                    }

                    var rect4 = new cc.Rect(
                        layer.divide.x - layer.divide.width / 2,
                        layer.divide.y - layer.divide.height / 2,
                        layer.divide.width,
                        layer.divide.height
                    );

                    if (cc.rectContainsPoint(rect4, point)) {
                        layer.ok1 = 4;   // "divide key be pressed"
                    }

                    var rect5 = new cc.Rect(
                        layer.equal.x - layer.equal.width / 2,
                        layer.equal.y - layer.equal.height / 2,
                        layer.equal.width,
                        layer.equal.height
                    );

                    if (cc.rectContainsPoint(rect5, point)) {
                        layer.ok1 = 5;   // "equal key be pressed"
                    }

                    var rect6 = new cc.Rect(
                        layer.cancel.x - layer.cancel.width / 2,
                        layer.cancel.y - layer.cancel.height / 2,
                        layer.cancel.width,
                        layer.cancel.height
                    );

                    if (cc.rectContainsPoint(rect6, point)) {
                        layer.ok1 = 6;   // "cancel key be pressed"
                    }

                    if (layer.ok1 == 0) {   //  input number 0 ~ 9
                        for (i = 0; i < layer.rects.length; i++) {
                            if (cc.rectContainsPoint(layer.rects[i], point)) {
                                layer.inputString += i;
                                layer.input.setColor(cc.color(0, 0, 0));
                                layer.input.setString(layer.inputString);
                                break;
                            }
                        }
                    }
                    if ((layer.ok1 != 6) && (layer.ok1 != 0)) {
                        if (layer.outputString != " ") {
                            if (layer.inputString != " ") {
                                if (layer.ok2 == 1) {
                                    layer.num = layer.num + parseFloat(layer.inputString)
                                }
                                if (layer.ok2 == 2) {
                                    layer.num = layer.num - parseFloat(layer.inputString)
                                }
                                if (layer.ok2 == 3) {
                                    layer.num = layer.num * parseFloat(layer.inputString)
                                }
                                if (layer.ok2 == 4) {
                                    var t = parseFloat(layer.inputString);
                                    if (t == 0) {
                                        layer.input.setColor(cc.color(255, 0, 0));
                                        layer.inputString = "你累了嗎? 按C重新";
                                        layer.input.setString(layer.inputString);
                                    } else {
                                        layer.num = layer.num / parseFloat(layer.inputString)
                                    }
                                }
                                if (layer.ok2 == 5) {
                                    layer.num = parseFloat(layer.inputString);
                                }
                                layer.num = Math.round(layer.num * 100) / 100;
                                if (layer.ok1 == 1) {
                                    layer.outputString = layer.num + " + "
                                }
                                if (layer.ok1 == 2) {
                                    layer.outputString = layer.num + " - "
                                }
                                if (layer.ok1 == 3) {
                                    layer.outputString = layer.num + " * "
                                }
                                if (layer.ok1 == 4) {
                                    layer.outputString = layer.num + " / "
                                }
                                if (layer.ok1 == 5) {
                                    layer.outputString = "= " + layer.num
                                }

                                if ((layer.ok2 == 4) && (t == 0)) {
                                    layer.output.setColor(cc.color(0, 0, 0));
                                    layer.ok2 = layer.ok1;
                                    layer.ok1 = 0;
                                } else {
                                    layer.output.setString(layer.outputString);
                                    layer.inputString = " ";
                                    layer.input.setString(layer.inputString);
                                    layer.input.setColor(cc.color(0, 0, 0));
                                    layer.output.setColor(cc.color(0, 0, 0));
                                    layer.ok2 = layer.ok1;
                                    layer.ok1 = 0;
                                }
                            } else {
                                if (layer.ok1 == 1) {
                                    layer.outputString = layer.num + " + "
                                }
                                if (layer.ok1 == 2) {
                                    layer.outputString = layer.num + " - "
                                }
                                if (layer.ok1 == 3) {
                                    layer.outputString = layer.num + " * "
                                }
                                if (layer.ok1 == 4) {
                                    layer.outputString = layer.num + " / "
                                }
                                if (layer.ok1 == 5) {
                                    layer.outputString = "= " + layer.num
                                }
                                layer.output.setString(layer.outputString);
                                layer.inputString = " ";
                                layer.input.setString(layer.inputString);
                                layer.input.setColor(cc.color(0, 0, 0));
                                layer.output.setColor(cc.color(0, 0, 0));
                                layer.ok2 = layer.ok1;
                                layer.ok1 = 0;
                            }
                        }
                        else {
                            if (layer.inputString != " ") {
                                layer.num = Math.round(parseFloat(layer.inputString * 100)) / 100;
                                if (layer.ok1 == 1) {
                                    layer.outputString = layer.num + " + "
                                }
                                if (layer.ok1 == 2) {
                                    layer.outputString = layer.num + " - "
                                }
                                if (layer.ok1 == 3) {
                                    layer.outputString = layer.num + " * "
                                }
                                if (layer.ok1 == 4) {
                                    layer.outputString = layer.num + " / "
                                }
                                if (layer.ok1 == 5) {
                                    layer.outputString = "= " + layer.num
                                }
                                layer.output.setString(layer.outputString);
                                layer.inputString = " ";
                                layer.input.setString(layer.inputString);
                                layer.input.setColor(cc.color(0, 0, 0));
                                layer.output.setColor(cc.color(0, 0, 0));
                                layer.ok2 = layer.ok1;
                                layer.ok1 = 0;
                            } else {
                                layer.input.setColor(cc.color(255, 0, 0));
                                layer.inputString = "你累了嗎? 按C重新";
                                layer.input.setString(layer.inputString);
                                layer.ok2 = layer.ok1;  //
                                layer.ok1 = 0;
                            }
                        }
                    } else {
                        if (layer.ok1 != 0) {
                            layer.ok2 = 0;
                            layer.ok1 = 0;
                            layer.num = 0;
                            layer.inputString = " ";
                            layer.outputString = " ";
                            layer.input.setString(layer.inputString);
                            layer.output.setString(layer.inputString);
                            // layer.ok1 = 0;
                            // layer.inputString = layer.inputString + ".";
                            // layer.input.setString(layer.inputString);
                        }
                    }
                }
            };
            cc.eventManager.addListener(mouseListener, this);
        }
    }
});

var frank06Scene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new frank06Layer();
        this.addChild(layer);
    }
});