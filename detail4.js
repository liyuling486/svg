
var dragData = [];
function reload() {
    $(function () {
        var html = "";
        var g = "";
        if ($('svg').siblings()) {
            var prev = $('svg').siblings();
            for (var i = 0; i < prev.length; i++) {
                prev[i].remove();
            }
        }
        for (var i = 0; i < dragData.length; i++) {
            if (dragData[i] != undefined) {
                var data = dragData[i];
                html +=
                    `<li class = "${data.name}" data-id = "${data.id}" data-inx = "${data.inx}" data-iny = "${data.iny}" data-label = "${data.label}" ondragstart = "insideDrag(this)"  draggable = "true" style = "transform:translate(${data.x}px,${data.y}px)">
                        <span class = "${data.icon}" data-id = "${data.id}"></span>
                        <span data-id = "${data.id}">${data.label}</span>
                        <div class = "input">
                            <span class = "point" style = "display:${data.point}"></span>
                            <span class = "circle" title = "输入" style = "display:${data.circle}" onmousedown = "noDrag(this)" onmouseup = "addDrag(this)" onmouseleave = "draw(this)" onmouseenter = "noMove()" data-type="left"></span>
                        </div>
                        <div class = "output">
                            <span class = "circle" title = "输出" onmousedown = "noDrag(this)" onmouseup = "addDrag(this)" onmouseleave = "draw(this)" onmouseenter = "noMove()" data-id = "${data.id}" data-type="right"></span>
                        </div>
                        <div class = "input top">
                            <span class = "point" style = "display:${data.point}"></span>
                            <span class = "circle" title = "输入" style = "display:${data.circle}" onmousedown = "noDrag(this)" onmouseup = "addDrag(this)" onmouseleave = "draw(this)" onmouseenter = "noMove()" data-type="top"></span>
                        </div>
                        <div class = "output bottom">
                            <span class = "circle" title = "输出" onmousedown = "noDrag(this)" onmouseup = "addDrag(this)" onmouseleave = "draw(this)" onmouseenter = "noMove()" data-id = "${data.id}" data-type="bottom"></span>
                        </div>
                    </li>
                `
                if (data.link.length > 0) {
                    for (var j = 0; j < data.link.length; j++) {
                        g +=
                            `<g class = "${data.link[j].name}">
                            <line x1="${data.link[j].outx}" y1="${data.link[j].outy}" x2="${data.link[j].dx}" y2="${data.link[j].dy}" style="stroke:#CCCCCC;stroke-width:2" marker-start="url(#markerArrow)  marker-end="url(#markerArrow)"/>
                        </g>`
                    }
                }
            }
        }
        $('svg').before(html);
        $('svg').html(g);
    })
}
document.getElementById('left').ondragover = function (e) {
    e.preventDefault();
}
var dWidth = Number($('#left').css('width').slice(0, -2));
var dHeight = Number($('#left').css('height').slice(0, -2));

var dClient = $("#left").offset().top;
var dLeft = $("#left").offset().left;
function drag(word, name, type, id) {
    document.getElementById('left').ondrop = function (e) {
        var x;
        var y;
        x = Math.round((e.clientX - dLeft) / 250) * 250;
        y = Math.round((e.clientY - dClient) / 120) * 120;
        if (type == "outside") {
            dragData.push({
                id: dragData.length,
                label: word,
                name: name,
                x: x,
                y: y,
                outx: x + 200,
                outy: y + 40,
                inx: x,
                iny: y + 40,
                link: [],
                linked: [],
                dx: 0,
                dy: 0,
                mx1: 0,
                my1: 0,
                mx2: 0,
                my2: 0,
                style: name,
                point: "none",
                circle: "inline-block",
                draw: false,
                icon: name + "Icon"
            });
            reload();
        }
        if (type == "inside") {
            for (var i = 0; i < dragData.length; i++) {
                if (id == dragData[i].id) {
                    dragData[i].x = x;
                    dragData[i].y = y;
                    dragData[i].outx = dragData[i].x + 200;
                    dragData[i].outy = dragData[i].y + 40;
                    dragData[i].inx = dragData[i].x;
                    dragData[i].iny = dragData[i].y + 40;

                    for (let j = 0; j < dragData[i].link.length; j++) {
                        dragData[i].link[j].linkId = parseFloat(dragData[i].link[j].name.split("|")[1]);
                    }
                    for (var k = 0; k < dragData[i].linked.length; k++) {
                        for (let j = 0; j < dragData.length; j++) {
                            if (dragData[i].linked[k].linkedNum == dragData[j].id) {
                                for (let m = 0; m < dragData[j].link.length; m++) {
                                    if (dragData[i].linked[k].name == dragData[j].link[m].name) {
                                        
                                        dragData[j].link[m].mx1 = dragData[j].outx;
                                        dragData[j].link[m].my1 = dragData[j].link[m].dy > dragData[j].outy ? dragData[j].outy + (dragData[j].link[m].dy - dragData[j].outy) / 4 : dragData[j].outy - (dragData[j].link[m].dy - dragData[j].outy) / 4;
                                        dragData[j].link[m].mx2 = dragData[j].outx + (dragData[j].link[m].dx - dragData[j].outx) / 2,
                                            dragData[j].link[m].my2 = dragData[j].outy + (dragData[j].link[m].dy - dragData[j].outy) / 2

                                        var dx, dy;
                                        switch(dragData[j].link[m].inType) {
                                            case 'left':
                                                dx = dragData[i].x;
                                                dy = dragData[i].y + 40;
                                                break;
                                            case 'right':
                                                dx = dragData[i].x + 200;
                                                dy = dragData[i].y + 40;
                                                break;
                                            case 'top':
                                                dx = dragData[i].x + 100;
                                                dy = dragData[i].y;
                                                break;
                                            case 'bottom':
                                                dx = dragData[i].x + 100;
                                                dy = dragData[i].y + 80;
                                                break;
                                        }
                                        dragData[j].link[m].dx = dx;
                                        dragData[j].link[m].dy = dy;

                                    }
                                }
                            }
                        }
                    }
                    if (dragData[i].link.length > 0) {
                        for (var j = 0; j < dragData[i].link.length; j++) {
                            dragData[i].link[j].mx1 = dragData[i].outx;
                            dragData[i].link[j].my1 = dragData[i].link[j].dy > dragData[i].outy ? dragData[i].outy + (dragData[i].link[j].dy - dragData[i].outy) / 4 : dragData[i].outy - (dragData[i].link[j].dy - dragData[i].outy) / 4;
                            dragData[i].link[j].mx2 = dragData[i].outx + (dragData[i].link[j].dx - dragData[i].outx) / 2,
                                dragData[i].link[j].my2 = dragData[i].outy + (dragData[i].link[j].dy - dragData[i].outy) / 2

                                var outx, outy;
                                switch(dragData[i].link[j].outType) {
                                    case 'left':
                                        outx = dragData[i].x;
                                        outy = dragData[i].y + 40;
                                        break;
                                    case 'right':
                                        outx = dragData[i].x + 200;
                                        outy = dragData[i].y + 40;
                                        break;
                                    case 'top':
                                        outx = dragData[i].x + 100;
                                        outy = dragData[i].y;
                                        break;
                                    case 'bottom':
                                        outx = dragData[i].x + 100;
                                        outy = dragData[i].y + 80;
                                        break;
                                }
                                dragData[i].link[j].outx = outx;
                                dragData[i].link[j].outy = outy;
                        }
                    }
                }
            }
            reload();
        }
    }
}
var displayDevice = $('.display-device li');
for (var i = 0; i < displayDevice.length; i++) {
    displayDevice[i].ondragstart = function () {
        drag(this.innerHTML, this.dataset.name, 'outside');
    }
}
function insideDrag(item) {
    drag(item.dataset.label, item.className, 'inside', item.dataset.id);
}
function noDrag(item) {
    item.parentNode.parentNode.setAttribute('draggable', false);
    var parent = item.parentNode.parentNode;
    for (var i = 0; i < dragData.length; i++) {
        if (parent.dataset.id == dragData[i].id) {
            dragData[i].draw = true;
            dragData[i].link.push({
                name: parent.dataset.id + parent.className,
                dx: 0,
                dy: 0,
                mx1: 0,
                my1: 0,
                mx2: 0,
                my2: 0
            });
            $('body').on('mouseup', function (e) {
                for (var j = 0; j < dragData.length; j++) {
                    if (parent.dataset.id == dragData[j].id) {
                        dragData[j].draw = false;

                        if(e.target.className == 'circle' && parent.className !== e.target.parentNode.parentNode.className){
                                $('svg').unbind('mousemove');
                                dragData[j].link[dragData[j].link.length - 1].inType = $(e.toElement).data('type');
                                dragData[j].link[dragData[j].link.length - 1].name = dragData[j].link[dragData[j].link.length - 1].name + "|" + e.target.parentNode.parentNode.dataset.id + e.target.parentNode.parentNode.className;

                                for (let i = 0; i < dragData.length; i++) {
                                    if (e.target.parentNode.parentNode.dataset.id == dragData[i].id) {
                                        dragData[i].linked.push({
                                            name: dragData[j].link[dragData[j].link.length - 1].name,
                                            linkedNum: parseFloat(dragData[j].link[dragData[j].link.length - 1].name)
                                        })
                                    }
                                }
                        }else{
                            
                            dragData[j].link.splice(dragData[j].link.length - 1, 1);
                            $('svg').unbind('mousemove');
                            // reload();
                        }
                        reload();
                    }
                }
                $('body').unbind('mouseup');
            })
        }
    }
}
function addDrag(item) {
    item.parentNode.parentNode.setAttribute('draggable', true);
    var parent = item.parentNode.parentNode;
    for (var i = 0; i < dragData.length; i++) {
        if (parent.dataset.id == dragData[i].id) {
            dragData[i].draw = false;
        }
    }
}
function draw(item) {
    item.parentNode.parentNode.setAttribute('draggable', true);
    var parent = item.parentNode.parentNode;
    for (var i = 0; i < dragData.length; i++) {
        if (parent.dataset.id == dragData[i].id) {
            if (dragData[i].draw == true) {
                $('svg').mousemove(function (e) {
                    for (var i = 0; i < dragData.length; i++) {

                        var outx, outy; // 线段   起始位置
                        switch($(item).data('type')) {
                            case 'left':
                                outx = dragData[i].x;
                                outy = dragData[i].y + 40;
                                break;
                            case 'right':
                                outx = dragData[i].x + 200;
                                outy = dragData[i].y + 40;
                                break;
                            case 'top':
                                outx = dragData[i].x + 100;
                                outy = dragData[i].y;
                                break;
                            case 'bottom':
                                outx = dragData[i].x + 100;
                                outy = dragData[i].y + 80;
                                break;
                        }
                        dragData[i].outx = outx
                        dragData[i].outy = outy
                        if (parent.dataset.id == dragData[i].id) {
                            if (dragData[i].link[dragData[i].link.length - 1]) {
                                dragData[i].link[dragData[i].link.length - 1].dx = e.offsetX;
                                dragData[i].link[dragData[i].link.length - 1].dy = e.offsetY;
                                dragData[i].link[dragData[i].link.length - 1].mx1 = dragData[i].outx;
                                dragData[i].link[dragData[i].link.length - 1].my1 = dragData[i].dy > dragData[i].outy ? dragData[i].outy + (dragData[i].dy - dragData[i].outy) / 4 : dragData[i].outy - (dragData[i].dy - dragData[i].outy) / 4;
                                dragData[i].link[dragData[i].link.length - 1].mx2 = dragData[i].outx + (dragData[i].dx - dragData[i].outx) / 2,
                                    dragData[i].link[dragData[i].link.length - 1].my2 = dragData[i].outy + (dragData[i].dy - dragData[i].outy) / 2

                                dragData[i].link[dragData[i].link.length - 1].outType = $(item).data('type');
                                dragData[i].link[dragData[i].link.length - 1].outx = outx
                                dragData[i].link[dragData[i].link.length - 1].outy = outy

                            }

                            dragData[i].dx = e.offsetX;
                            dragData[i].dy = e.offsetY;
                            dragData[i].mx1 = dragData[i].outx;
                            if (dragData[i].dy > dragData[i].outy) {
                                dragData[i].my1 = dragData[i].outy + (dragData[i].dy - dragData[i].outy) / 4;
                            } else {
                                dragData[i].my1 = dragData[i].outy - (dragData[i].dy - dragData[i].outy) / 4;
                            }
                            dragData[i].mx2 = dragData[i].outx + (dragData[i].dx - dragData[i].outx) / 2
                            dragData[i].my2 = dragData[i].outy + (dragData[i].dy - dragData[i].outy) / 2

                        }
                    }
                    
                    reload();
                })
            } else {
                $('svg').unbind('mousemove');
            }

        }
    }
}


function noMove() {
    $('svg').unbind('mousemove');
}
$('svg').mouseup(function (e) {
    $('svg').unbind('mousemove');
    for (var i = 0; i < dragData.length; i++) {
        dragData[i].draw = false;
    }
})