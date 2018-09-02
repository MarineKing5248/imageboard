//random boxes
(function() {
    for (var i = 0; i < 100; i++) {
        var li = $("imagesContainer");
        li.w = (Math.random() * 300 + 300) | 0;
        li.h = (Math.random() * 200 + 200) | 0;
        li.k = li.w / li.h;
    }
    format();
})();
//resize
function format() {
    const wall = $(".imageDisplay");
    var WIDTH = wall.offsetWidth - 10,
        HEIGHT = 50,
        MARGIN = 10;
    var l = 0,
        r = 0,
        k = 0,
        s = wall.children,
        rowWidth = 0;
    //遍历元素
    for (r = 0; r < s.length; r++) {
    //计算缩放后的宽度
        s[r].scaledWidth = (HEIGHT / s[r].h) * s[r].w;
        //计算占用的宽度
        var usedWidth = s[r].scaledWidth + MARGIN;
        //如果该行放不下缩放后的元素则
        if (rowWidth + usedWidth > WIDTH)
        //对剩余的空白进行微调，并重置行参数
            resize(WIDTH - rowWidth + MARGIN), (rowWidth = 0), (k = 0);
        //累加行参数
        k += s[r].k;
        rowWidth += usedWidth;
    }
    //对末行处理
    resize(0);
    //处理微调
    function resize(trimming) {
        for (var h = trimming / k; l < r; l++)
            (s[l].style.width = ((s[l].scaledWidth + s[l].k * h) | 0) + "px"),
            (s[l].style.height = ((HEIGHT + h) | 0) + "px");
    }
}

//绑定事件
window.onresize = format;
