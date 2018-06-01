
var Dirfter = (function ($) {
    var $main;
    var $curCube;
    var isDrawing = false; //是否画框中
    var isCubeDragging = false; //是否移动框中
    var isCubeResizing = false; //是否改变大小中
    var curDirection; //当前方向
    var startPoint = [0, 0];
    var cubeOriPoint = [0, 0];
    var cubeOriSize = [0, 0];
    var imgWidth, imgHeight;

    function changeWidth(v1, v2){
        var sum = v1 + v2;
        if (sum + $curCube.width() > imgWidth){
            sum = imgWidth - $curCube.width();
        } else if (sum < 0){
            sum = 0;
        }
        return sum;
    }

    function changeHeight(v1, v2){
        var sum = v1 + v2;
        if (sum + $curCube.height() > imgHeight){
            sum = imgHeight - $curCube.height();
        } else if (sum < 0){
            sum = 0;
        }
        return sum;
    }

    //框
    function Cube() {
        $main.append('<div class="drifter-cube">' +
            '<div class="drifter-upBtn"></div>' +
            '<div class="drifter-downBtn"></div>' +
            '<div class="drifter-upLeftBtn"></div>' +
            '<div class="drifter-upRightBtn"></div>' +
            '<div class="drifter-downLeftBtn"></div>' +
            '<div class="drifter-downRightBtn"></div>' +
            '<div class="drifter-leftBtn"></div>' +
            '<div class="drifter-rightBtn"></div>' +
            '</div>');
        this.$cube = $main.children().last();
    }

    function getPx(val) {
        return Number(val.replace("px", ""));
    }

    function getImgNaturalDimensions(imgUrl) {
        var img = new Image();
        img.src = imgUrl;
        img.onload = function () {
            imgWidth = img.width;
            imgHeight = img.height;
        }
    }

    function bindEvent() {
        $main.mousedown(function (e) {
            e.preventDefault();
            var targetType = e.target.className.replace("drifter-", "");
            startPoint = [e.pageX, e.pageY];

            if (targetType === 'main') {
                isDrawing = true;
                $curCube = new Cube().$cube;
                $curCube.css({left: e.offsetX, top: e.offsetY});
            } else if (targetType === 'cube') {
                isCubeDragging = true;
                $curCube = $(e.target);
                cubeOriPoint = [getPx($curCube.css("left")), getPx($curCube.css("top"))];
            } else if (targetType.match(/^upBtn|downBtn|leftBtn|rightBtn|upLeftBtn|upRightBtn|downLeftBtn|downRightBtn$/)) {
                isCubeResizing = true;
                $curCube = $(e.target).parent();
                cubeOriPoint = [getPx($curCube.css("left")), getPx($curCube.css("top"))];
                cubeOriSize = [$curCube.width(), $curCube.height()];
                curDirection = targetType;
            }
        }).mousemove(function (e) {
            e.stopPropagation();
            var deviationX = e.pageX - startPoint[0];
            var deviationY = e.pageY - startPoint[1];
            if (isDrawing) {
                $curCube.css({
                    width: deviationX,
                    height: deviationY
                });
            } else if (isCubeDragging) {
                $curCube.css({
                    left: changeWidth(cubeOriPoint[0], deviationX),
                    top: changeHeight(cubeOriPoint[1], deviationY)
                });
            } else if (isCubeResizing) {
                switch (curDirection) {
                    case 'upBtn' :
                        $curCube.css({
                            top: cubeOriPoint[1] + deviationY,
                            height: cubeOriSize[1] - deviationY
                        });
                        break;
                    case 'downBtn' :
                        $curCube.height(cubeOriSize[1] + deviationY);
                        break;
                    case 'leftBtn' :
                        $curCube.css({
                            left: cubeOriPoint[0] + deviationX,
                            width: cubeOriSize[0] - deviationX
                        });
                        break;
                    case 'rightBtn' :
                        $curCube.width(cubeOriSize[0] + deviationX);
                        break;
                    case 'upLeftBtn' :
                        $curCube.css({
                            top: cubeOriPoint[1] + deviationY,
                            height: cubeOriSize[1] - deviationY,
                            left: cubeOriPoint[0] + deviationX,
                            width: cubeOriSize[0] - deviationX
                        });
                        break;
                    case 'upRightBtn' :
                        $curCube.css({
                            top: cubeOriPoint[1] + deviationY,
                            height: cubeOriSize[1] - deviationY,
                            width: cubeOriSize[0] + deviationX
                        });
                        break;
                    case 'downLeftBtn' :
                        $curCube.css({
                            height: cubeOriSize[1] + deviationY,
                            left: cubeOriPoint[0] + deviationX,
                            width: cubeOriSize[0] - deviationX
                        });
                        break;
                    case 'downRightBtn' :
                        $curCube.css({
                            height: cubeOriSize[1] + deviationY,
                            width: cubeOriSize[0] + deviationX
                        });
                        break;
                }
            }
        });

        $("body").mouseup(function () {
            isDrawing = false;
            isCubeDragging = false;
            isCubeResizing = false;
        });
    }

    function init(dom, imgUrl) {
        $main = $(dom);
        $main.addClass("drifter-main");
        $main.css('background', 'url("'+imgUrl+'") no-repeat');
        getImgNaturalDimensions(imgUrl);
        bindEvent();
    }

    return {
        init: init
    }
}(jQuery));

$.fn.drifter = function (imgUrl) {
    Dirfter.init(this, imgUrl);
};