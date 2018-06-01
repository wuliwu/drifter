var Drifter = function () {
    this.isDrawing = false; //是否画框中
    this.isCubeDragging = false; //是否移动框中
    this.isCubeResizing = false; //是否改变大小中
    this.startPoint = [0, 0];
    this.cubeOriPoint = [0, 0];
    this.cubeOriSize = [0, 0];
};

Drifter.prototype.changeWidth = function (v1, v2) {
    var sum = v1 + v2;
    if (sum + this.$curCube.width() > this.imgWidth) {
        sum = this.imgWidth - this.$curCube.width();
    } else if (sum < 0) {
        sum = 0;
    }
    return sum;
};

Drifter.prototype.changeHeight = function (v1, v2) {
    var sum = v1 + v2;
    if (sum + this.$curCube.height() > this.imgHeight) {
        sum = this.imgHeight - this.$curCube.height();
    } else if (sum < 0) {
        sum = 0;
    }
    return sum;
};

//新增框
Drifter.prototype.addCube = function () {
    this.$main.append('<div class="drifter-cube">' +
        '<div class="drifter-upBtn"></div>' +
        '<div class="drifter-downBtn"></div>' +
        '<div class="drifter-upLeftBtn"></div>' +
        '<div class="drifter-upRightBtn"></div>' +
        '<div class="drifter-downLeftBtn"></div>' +
        '<div class="drifter-downRightBtn"></div>' +
        '<div class="drifter-leftBtn"></div>' +
        '<div class="drifter-rightBtn"></div>' +
        '</div>');
    return this.$main.children().last();
};

Drifter.prototype.getPx = function (val) {
    return Number(val.replace("px", ""));
};

Drifter.prototype.getImgNaturalDimensions = function (imgUrl) {
    var that = this;
    var img = new Image();
    img.src = imgUrl;
    img.onload = function () {
        that.imgWidth = img.width;
        that.imgHeight = img.height;
        that.$main.css({
            width: img.width,
            height: img.height
        });
        that.$main.show();
    }
};

Drifter.prototype.bindEvent = function () {
    var $main = this.$main;
    var that = this;
    $main.mousedown(function (e) {
        e.preventDefault();
        var targetType = e.target.className.replace("drifter-", "");
        that.startPoint = [e.pageX, e.pageY];

        if (targetType === 'main') {
            that.isDrawing = true;
            that.$curCube = that.addCube();
            that.$curCube.css({left: e.offsetX, top: e.offsetY});
        } else if (targetType === 'cube') {
            that.isCubeDragging = true;
            that.$curCube = $(e.target);
            that.cubeOriPoint = [that.getPx(that.$curCube.css("left")), that.getPx(that.$curCube.css("top"))];
        } else if (targetType.match(/^upBtn|downBtn|leftBtn|rightBtn|upLeftBtn|upRightBtn|downLeftBtn|downRightBtn$/)) {
            that.isCubeResizing = true;
            that.$curCube = $(e.target).parent();
            that.cubeOriPoint = [that.getPx(that.$curCube.css("left")), that.getPx(that.$curCube.css("top"))];
            that.cubeOriSize = [that.$curCube.width(), that.$curCube.height()];
            that.curDirection = targetType;
        }
    }).mousemove(function (e) {
        e.stopPropagation();
        var deviationX = e.pageX - that.startPoint[0];
        var deviationY = e.pageY - that.startPoint[1];
        if (that.isDrawing) {
            that.$curCube.css({
                width: deviationX,
                height: deviationY
            });
        } else if (that.isCubeDragging) {
            that.$curCube.css({
                left: that.changeWidth(that.cubeOriPoint[0], deviationX),
                top: that.changeHeight(that.cubeOriPoint[1], deviationY)
            });
        } else if (that.isCubeResizing) {
            switch (that.curDirection) {
                case 'upBtn' :
                    that.$curCube.css({
                        top: that.cubeOriPoint[1] + deviationY,
                        height: that.cubeOriSize[1] - deviationY
                    });
                    break;
                case 'downBtn' :
                    that.$curCube.height(that.cubeOriSize[1] + deviationY);
                    break;
                case 'leftBtn' :
                    that.$curCube.css({
                        left: that.cubeOriPoint[0] + deviationX,
                        width: that.cubeOriSize[0] - deviationX
                    });
                    break;
                case 'rightBtn' :
                    that.$curCube.width(that.cubeOriSize[0] + deviationX);
                    break;
                case 'upLeftBtn' :
                    that.$curCube.css({
                        top: that.cubeOriPoint[1] + deviationY,
                        height: that.cubeOriSize[1] - deviationY,
                        left: that.cubeOriPoint[0] + deviationX,
                        width: that.cubeOriSize[0] - deviationX
                    });
                    break;
                case 'upRightBtn' :
                    that.$curCube.css({
                        top: that.cubeOriPoint[1] + deviationY,
                        height: that.cubeOriSize[1] - deviationY,
                        width: that.cubeOriSize[0] + deviationX
                    });
                    break;
                case 'downLeftBtn' :
                    that.$curCube.css({
                        height: that.cubeOriSize[1] + deviationY,
                        left: that.cubeOriPoint[0] + deviationX,
                        width: that.cubeOriSize[0] - deviationX
                    });
                    break;
                case 'downRightBtn' :
                    that.$curCube.css({
                        height: that.cubeOriSize[1] + deviationY,
                        width: that.cubeOriSize[0] + deviationX
                    });
                    break;
            }
        }
    });

    $("body").mouseup(function () {
        that.isDrawing = false;
        that.isCubeDragging = false;
        that.isCubeResizing = false;
    });
};

Drifter.prototype.getCubes = function () {
    var arr = [];
    this.$main.find(".drifter-cube").each(function () {
        var $cube = $(this);
        var cubeOffset = $cube.offset();
        arr.push({
            x1: cubeOffset.left,
            y1: cubeOffset.top,
            w: $cube.width(),
            h: $cube.height(),
            x2: cubeOffset.left + $cube.width(),
            y2: cubeOffset.top + $cube.height()
        });
    });
    return arr;
};


Drifter.prototype.init = function ($main, settings) {
    var imgUrl = settings.imgUrl;
    this.$main = $main;
    $main.hide();
    $main.addClass("drifter-main");
    $main.css('background', 'url("' + imgUrl + '") no-repeat');
    this.getImgNaturalDimensions(imgUrl);
    this.bindEvent();
};

$.fn.drifter = function (settings) {
    var drifter = new Drifter();
    drifter.init($(this), settings);
    return drifter;
};

