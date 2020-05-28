// // mouse
// var mousex;
// var mousey;

// context
var canvas;
var context;
// var showOnlyRect = false;

var draw_mode = "draw"; // "draw_stairs"

// red dots - path of cursor
var clickx = new Array();
var clicky = new Array();
var clickDrag = new Array();

// draw rect_mode: new, drug, corners: nw, se, etc
var rect_mode = "";

// rect
var rect_ix = 0;
var rect_iy = 0;
var rect_w = 0;
var rect_h = 0;
var distanceFromCorner = 10; // 5 px from in any direction

// colors
var paint = false;
var boardColor = "rgb(232,230,215)";
var stairsColor = "#c9b21c";

var stairsColorSet = [
    "rgba(154,151,116,0.82)","rgba(163,155,102,0.93)","rgba(222,216,167,0.89)",
    "rgba(206,186,164,0.92)","rgba(170,159,104,0.94)","rgba(201,171,148,0.88)",
    "rgba(184,158,126,0.91)","rgba(173,150,111,0.92)","rgba(184,146,124,0.94)"
];

var stairsLine = "#cebe36";
var stairsCenters = "#ff6600";
var rectColor = "#3357ff";

// stairs
var current_center_x = 0;
var current_center_y = 0;
// var stairsWidthRatio = 0.2;
var stairsWidthRatio = 0.15;
var stair_length = 0;
var stair_width = 0;
var stairsx = new Array();
var stairsy = new Array();
var stairsdrag = new Array();
var single_stair = new Array();  // array [x, y, w, h]
var stairs = new Array();


function init() {
    console.log("init")
    var el = document.getElementById("sketch");
    el.onpointerdown = down_handler;
    el.onpointermove = move_handler;
    el.onpointerup = up_handler;
     // Register pointer event handlers
    // el.onpointerover = over_handler;
    // el.onpointerenter = enter_handler;
    // el.onpointercancel = cancel_handler;
    // el.onpointerout = out_handler;
    // el.onpointerleave = leave_handler;
    // el.gotpointercapture = gotcapture_handler;
    // el.lostpointercapture = lostcapture_handler;
    // el.onpointerover = generalHandler;
    // el.onpointerenter = generalHandler;
    // el.onpointerdown = generalHandler;
    // el.onpointermove = generalHandler;
    // el.onpointerup = generalHandler;
    // el.onpointercancel = generalHandler;
    // el.onpointerout = generalHandler;
    // el.onpointerleave = generalHandler;
    // el.gotpointercapture = generalHandler;
    // el.lostpointercapture = generalHandler;
}
function checkNear(pointx, pointy, mousex, mousey) {
    return ((pointx - mousex) ** 2 + (pointy - mousey) ** 2) < distanceFromCorner ** 2
}
function checkFar(pointx, pointy, mousex, mousey, distance) {
    // if (mousex == null || mousey == null || pointx == null || pointy == null) {
    //     console.log("could not check how far", pointx, pointy, mousex, mousey, distance);
    // }
    return (
        ((pointx - mousex) ** 2 + (pointy - mousey) ** 2) > distance ** 2) ||
        mousex == null || mousey == null || pointx == null || pointy == null
}
function checkOutside(mousex, mousey) {
    return     (
        mousex < rect_ix
        || mousex > rect_ix + rect_w
        || mousey < rect_iy
        || mousey > rect_iy + rect_h
    )
}
function getAngle(prevx, prevy, nextx, nexty) {
    // return ((pointx - mousex) ** 2 + (pointy - mousey) ** 2) < distanceFromCorner ** 2

    if (prevx == nextx) {
        return Math.PI / 2
    } else {
        // return Math.atan((nexty - prevy) / (nextx - prevy))
        return Math.atan2((nexty - prevy), (nextx - prevx))
    }
}


/**
 - Clear the canvas and redraw
 **/
function redraw() {
    // console.log("draw - redraw")
    // console.log(
    //     rect_ix,
    //     rect_iy,
    //     rect_w,
    //     rect_h
    // )


    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    // // repaint board
    // context.fillStyle = boardColor;
    // // context.fillStyle = "#FF0000";
    // context.fillRect(0, 0, canvas.width, canvas.height);
    // //
    // // context.drawImage(img, 0, 0);
    // // ctx.drawImage(img, 0, 0);
    // // ctx.beginPath();
    // // ctx.moveTo(30, 96);
    // // ctx.lineTo(70, 66);
    // // ctx.lineTo(103, 76);
    // // ctx.lineTo(170, 15);
    // // ctx.stroke();

    // re-draw stairs
    context.strokeStyle = stairsLine;
    context.lineJoin = "round";
    context.lineWidth = 3;

    // define stair length
    stair_width = Math.ceil(Math.min(rect_w, rect_h));
    stair_length = Math.ceil(stairsWidthRatio * stair_width);

    // set starting point for stairs center

    // console.log("stairsx[0]: ", stairsx[0])

    // var current_center_x = stairsx[0]
    // var current_center_y = stairsy[0]

    for (var i = 0; i < stairsx.length; i++) {

        context.strokeStyle = stairsLine;

        context.beginPath();
        if (stairsdrag[i] && i) {
            context.moveTo(stairsx[i - 1], stairsy[i - 1]);
        } else {
            context.moveTo(stairsx[i] - 1, stairsy[i]);
            // as line breaks mark new start of centers
            current_center_x = stairsx[i - 1];
            current_center_y = stairsy[i - 1];
        }
        context.lineTo(stairsx[i], stairsy[i]);
        context.closePath();
        context.stroke();

        // add center?
        if (stairsdrag[i] && i && checkFar(
            stairsx[i - 1], stairsy[i - 1],
            current_center_x, current_center_y,
            stair_length
        )) {
            // draw stair

            // console.log("Math.min(current_center_y, stairsy[i - 1])",
            //     current_center_y, stairsy[i - 1],
            //     Math.min(current_center_y, stairsy[i - 1])
            // )

            //skipping first false stair
            if (current_center_x != null && current_center_y != null ) {

                context.save();
                // context.strokeStyle = stairsColor; // hz

                // stairsColor = Math.floor(Math.random()*stairsColorSet.length);
                // context.fillStyle = stairsColor;
                context.fillStyle = stairsColorSet[Math.floor(Math.random() * stairsColorSet.length)];
                // context.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
                context.translate(
                    current_center_x ,
                    current_center_y

                    // stairsx[i - 1],
                    // stairsy[i - 1]
                    // stairsx[i - 1] - Math.ceil(stair_width * 0.5),
                    // stairsy[i - 1] - Math.ceil(stair_length * 0.5)
                    // stairsx[i - 1] - Math.ceil(stair_length * 0.5),
                    // stairsy[i - 1] - Math.ceil(stair_width * 0.5)
                    // Math.min(current_center_x, stairsx[i - 1]),
                    // Math.min(current_center_y, stairsy[i - 1]) - Math.ceil(stair_width * 0.5)
                );

                // console.log("angle , gradus", getAngle(
                //     current_center_x, current_center_y,
                //     stairsx[i - 1], stairsy[i - 1]) * 180 / Math.PI)

                context.rotate(getAngle(
                    current_center_x, current_center_y,
                    stairsx[i - 1], stairsy[i - 1]));
                context.fillRect(0, - stair_width /2, stair_length, stair_width);
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.restore();

            }


            context.fillRect(stairsx[i - 1] - 5, stairsy[i - 1] - 5, 10, 10);

            // mark as new center
            current_center_x = stairsx[i - 1];
            current_center_y = stairsy[i - 1];
            // context.strokeStyle = stairsCenters;
            context.fillStyle = stairsCenters;
            context.fillRect(stairsx[i - 1] - 5, stairsy[i - 1] - 5, 10, 10);
            context.stroke();
        }
    }

    // re-draw rect , showOnlyRect
    context.lineWidth = 3;
    context.strokeStyle = rectColor;
    context.beginPath();
    context.rect(
        rect_ix,
        rect_iy,
        rect_w,
        rect_h,
    );
    context.stroke();

}

// select right handler
function down_handler(e) {
    var mousex = e.pageX - this.offsetLeft;
    var mousey = e.pageY - this.offsetTop;

    // put initial values for testing for centers
    current_center_x = mousex;
    current_center_y = mousey;

    switch (draw_mode) {
        case "draw_rect":
            // console.log("draw - down_handler selector")
            // console.log(this)
            // console.log(e.pageX, this.offsetLeft, e.pageX - this.offsetLeft)
            // console.log(e.pageY, this.offsetTop, e.pageY - this.offsetTop)
            down_handler_rect(mousex, mousey);
            break
        case "draw_stairs":
            down_handler_stairs(mousex, mousey);
            break
        default:
            console.log("down_handler get unknown drawing mode", draw_mode)
    }
}
function move_handler(e) {
    var mousex = e.pageX - this.offsetLeft;
    var mousey = e.pageY - this.offsetTop;
    switch (draw_mode) {
        case "draw_rect":
            move_handler_rect(mousex, mousey);
            break
        case "draw_stairs":
            move_handler_stairs(mousex, mousey);
            break
        default:
            console.log("Unknown drawing mode", draw_mode)
    }
}
function up_handler(e) {
    var mousex = e.pageX - this.offsetLeft;
    var mousey = e.pageY - this.offsetTop;
    switch (draw_mode) {
        case "draw_rect":
            up_handler_rect();
            break
        case "draw_stairs":
            up_handler_stairs(mousex, mousey)
            break
        default:
            console.log("Unknown drawing mode", draw_mode)
    }
}

// handling rect
function down_handler_rect(mousex, mousey) {
    // console.log("draw - down_handler: ", mousex, mousey)
    // console.log(e.pageX, this.offsetLeft, e.pageX - this.offsetLeft)
    // console.log(e.pageY, this.offsetTop, e.pageY - this.offsetTop)
    // var mousex = e.pageX - this.offsetLeft;
    // var mousey = e.pageY - this.offsetTop;
    // console.log(mousex, mousey)

    // clear mouse history
    clickx = [];
    clicky = [];
    paint = true;

    // detect painting rect_mode
    // new or drug existent rect?
    if (checkOutside(mousex, mousey)) {
        rect_mode = "new";

        rect_w = 0;
        rect_h = 0;

    } else {
        // console.log("drug");
        // console.log(mousex, mousey);
        
        clickx.push(mousex);
        clicky.push(mousey);

        rect_mode = "drug";
    }

    // // ... or drug corner?
    if (
        checkNear(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
    ) {
        // console.log("check se")
        // console.log(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
        rect_mode = "se";
    } else if (

        checkNear(rect_ix, rect_iy, mousex, mousey)
    ) {
        // console.log("check nw")
        // console.log(rect_ix, rect_iy, mousex, mousey, checkNear(rect_ix, rect_iy, mousex, mousey))
        rect_mode = "nw";
    }


    // showOnlyRect = false;

    // // count current corners
    // rectNWX = Math.min(rect_ix, rect_ix + rect_w);
    // rectNWY = Math.min(rect_iy, rect_iy + rect_h);
    //
    // rectSEX = Math.max(rect_ix, rect_ix + rect_w);
    // rectSEY = Math.max(rect_iy, rect_iy + rect_h);

    // checkNear(rectNWX, rectNWY, mousex, mousey)
    // checkNear(rectSEX, rectSEY, mousex, mousey)

    //
    // if (
    //     checkNear(rectNWX, rectNWY, mousex, mousey)
    // ) {
    //     console.log("catch corner rectNW");
    //     console.log(rectNWX, rectNWY, mousex, mousey, distanceFromCorner);
    //
    //     dragRect = false;
    //     drugCorner = "NW";
    //     drugCornerIX = mousex;
    //     drugCornerIY = mousey;
    //
    // } else if (
    //     // mousex < rectX[0] || mousex > rectX[rectX.length - 1] //|| mousey < rectY[0] || mousey < rectY[rectY.length - 1]
    //     mousex < Math.min(rect_ix, rect_ix + rect_w)
    //     || mousex > Math.max(rect_ix, rect_ix + rect_w) //|| mousey < rectY[0] || mousey < rectY[rectY.length - 1]
    //     || mousey < Math.min(rect_iy, rect_iy + rect_h)
    //     || mousey > Math.max(rect_iy, rect_iy + rect_h)
    //
    // ) {
    //     // console.log("reset rect");
    //     dragRect = false;
    //     rect_ix = mousex;
    //     rect_iy = mousey;
    //     drugIX = drugX;
    //     drugIY = drugY;
    // } else {
    //     // console.log("reset drag");
    //     dragRect = true;
    //     drugIX = mousex;
    //     drugIY = mousey;
    // }

    // addClickRect(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    addClickRect(mousex, mousey);
    redraw();

}
function move_handler_rect(mousex, mousey) {
    // console.log("draw - move_handler")

    if (paint) {
        addClickRect(mousex, mousey, true);
        redraw();
    }
}
function up_handler_rect() {
    // console.log("draw - up_handler_rect");
    // console.log(
    //     e.pageX - this.offsetLeft,
    //     e.pageY - this.offsetTop
    // );

    paint = false;
    // dragRect = false;
    // drugCorner = "";

    // rearrange rect
    rect_ix = Math.min(rect_ix, rect_ix + rect_w);
    rect_iy = Math.min(rect_iy, rect_iy + rect_h);

    rect_w = Math.abs(rect_w);
    rect_h = Math.abs(rect_h);

    if (isNaN(rect_ix) || isNaN(rect_iy) || isNaN(rect_w) || isNaN(rect_h) ) {
        // console.log("rect became  NaN");
        rect_ix = 0;
        rect_iy = 0;
        rect_w = 0;
        rect_h = 0;
        // console.log("rect restored to zero");
    }
    // console.log("rect rearrenged to: ", rect_ix, rect_iy, rect_w, rect_h)


    // clickx = [];
    // clicky = [];

}
function addClickRect(x, y, dragging) {

    // console.log("draw - addClickRect rect_mode ->", rect_mode)
    // console.log(rect_mode)
    // console.log(clickx.length)

    clickx.push(x);
    clicky.push(y);
    clickDrag.push(dragging);

    // if (drugCorner === "NW") {
    //     rect_ix = x;
    //     rect_iy = y;
    //     drugCornerW = (x - drugCornerIX);
    //     drugCornerH = (y - drugCornerIY);
    //     // rect_h = rect_h - (y - drugCornerIY);
    //
    // } else if (dragRect) {
    //     drugX = x;
    //     drugY = y;
    //
    // } else {
    //     rect_w = x - rect_ix;
    //     rect_h = y - rect_iy;
    // }
    switch (rect_mode){
        case "new":
            // console.log("draw - addClickRect new")

            rect_ix = clickx[0];
            rect_iy = clicky[0];

            rect_w = clickx[clickx.length - 1] - clickx[0]
            rect_h = clicky[clicky.length - 1] - clicky[0]

            break
        case "drug":
            // console.log("draw - addClickRect -drug ")
            // console.log(rect_ix, clickx[clickx.length - 1], clickx[0], x - clickx[0])
            rect_ix = rect_ix + (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
            rect_iy = rect_iy + (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
            // rect_iy = rect_iy + y - clicky[0]



            break
        case "nw":
            rect_ix = x;
            rect_w = rect_w - (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
            rect_iy = y;
            rect_h = rect_h - (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
            break
        case "se":
            rect_w = rect_w + (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
            rect_h = rect_h + (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
            break
        default:
            console.log("Unknown drawing rect_mode")


    }


}

// handling stairs
function down_handler_stairs(mousex, mousey) {
    // console.log("draw - down_handler_stairs: ", mousex, mousey)
    // console.log(e.pageX, this.offsetLeft, e.pageX - this.offsetLeft)
    // console.log(e.pageY, this.offsetTop, e.pageY - this.offsetTop)
    // var mousex = e.pageX - this.offsetLeft;
    // var mousey = e.pageY - this.offsetTop;
    // console.log(mousex, mousey)

    // clear mouse history
    clickx = [];
    clicky = [];
    paint = true;

    // // detect painting rect_mode
    // // new or drug existent rect?
    // if (checkOutside(mousex, mousey)) {
    //     rect_mode = "new";
    //
    //     rect_w = 0;
    //     rect_h = 0;
    //
    // } else {
    //     console.log("drug");
    //     console.log(mousex, mousey);
    //
    //     clickx.push(mousex);
    //     clicky.push(mousey);
    //
    //     rect_mode = "drug";
    // }
    //
    // // // ... or drug corner?
    // if (
    //     checkNear(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
    // ) {
    //     console.log("check se")
    //     console.log(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
    //     rect_mode = "se";
    // } else if (
    //
    //     checkNear(rect_ix, rect_iy, mousex, mousey)
    // ) {
    //     console.log("check nw")
    //     console.log(rect_ix, rect_iy, mousex, mousey, checkNear(rect_ix, rect_iy, mousex, mousey))
    //     rect_mode = "nw";
    // }
    // showOnlyRect = false;
    // // count current corners
    // rectNWX = Math.min(rect_ix, rect_ix + rect_w);
    // rectNWY = Math.min(rect_iy, rect_iy + rect_h);
    //
    // rectSEX = Math.max(rect_ix, rect_ix + rect_w);
    // rectSEY = Math.max(rect_iy, rect_iy + rect_h);
    // checkNear(rectNWX, rectNWY, mousex, mousey)
    // checkNear(rectSEX, rectSEY, mousex, mousey)
    //
    // if (
    //     checkNear(rectNWX, rectNWY, mousex, mousey)
    // ) {
    //     console.log("catch corner rectNW");
    //     console.log(rectNWX, rectNWY, mousex, mousey, distanceFromCorner);
    //
    //     dragRect = false;
    //     drugCorner = "NW";
    //     drugCornerIX = mousex;
    //     drugCornerIY = mousey;
    //
    // } else if (
    //     // mousex < rectX[0] || mousex > rectX[rectX.length - 1] //|| mousey < rectY[0] || mousey < rectY[rectY.length - 1]
    //     mousex < Math.min(rect_ix, rect_ix + rect_w)
    //     || mousex > Math.max(rect_ix, rect_ix + rect_w) //|| mousey < rectY[0] || mousey < rectY[rectY.length - 1]
    //     || mousey < Math.min(rect_iy, rect_iy + rect_h)
    //     || mousey > Math.max(rect_iy, rect_iy + rect_h)
    //
    // ) {
    //     // console.log("reset rect");
    //     dragRect = false;
    //     rect_ix = mousex;
    //     rect_iy = mousey;
    //     drugIX = drugX;
    //     drugIY = drugY;
    // } else {
    //     // console.log("reset drag");
    //     dragRect = true;
    //     drugIX = mousex;
    //     drugIY = mousey;
    // }

    // addClickRect(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    addClickStairs(mousex, mousey);
    redraw();

}
function move_handler_stairs(mousex, mousey) {
    // console.log("draw - move_handler_stairs")

    if (paint) {
        addClickStairs(mousex, mousey, true);
        redraw();
    }
}
function up_handler_stairs(mousex, mousey) {
    // console.log("draw - up_handler_stairs at: ", mousex, mousey);
    paint = false;
    // dragRect = false;
    // drugCorner = "";
    //
    // // rearrange rect
    // rect_ix = Math.min(rect_ix, rect_ix + rect_w);
    // rect_iy = Math.min(rect_iy, rect_iy + rect_h);
    //
    // rect_w = Math.abs(rect_w);
    // rect_h = Math.abs(rect_h);
    //
    // if (isNaN(rect_ix) || isNaN(rect_iy) || isNaN(rect_w) || isNaN(rect_h) ) {
    //     console.log("rect became  NaN");
    //     rect_ix = 0;
    //     rect_iy = 0;
    //     rect_w = 0;
    //     rect_h = 0;
    //     console.log("rect restored to zero");
    // }
    //
    // console.log("rect rearrenged to: ", rect_ix, rect_iy, rect_w, rect_h)
    //

    // clickx = [];
    // clicky = [];

}
function addClickStairs(x, y, dragging) {

    // console.log("draw - addClickStairs rect_mode ->", rect_mode)
    // console.log(rect_mode)
    // console.log(clickx.length)

    stairsx.push(x);
    stairsy.push(y);
    stairsdrag.push(dragging);

    // if (drugCorner === "NW") {
    //     rect_ix = x;
    //     rect_iy = y;
    //     drugCornerW = (x - drugCornerIX);
    //     drugCornerH = (y - drugCornerIY);
    //     // rect_h = rect_h - (y - drugCornerIY);
    //
    // } else if (dragRect) {
    //     drugX = x;
    //     drugY = y;
    //
    // } else {
    //     rect_w = x - rect_ix;
    //     rect_h = y - rect_iy;
    // }
    // switch (rect_mode){
    //     case "new":
    //         // console.log("draw - addClickRect new")
    //
    //         rect_ix = clickx[0];
    //         rect_iy = clicky[0];
    //
    //         rect_w = clickx[clickx.length - 1] - clickx[0]
    //         rect_h = clicky[clicky.length - 1] - clicky[0]
    //
    //         break
    //     case "drug":
    //         // console.log("draw - addClickRect -drug ")
    //         // console.log(rect_ix, clickx[clickx.length - 1], clickx[0], x - clickx[0])
    //         rect_ix = rect_ix + (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
    //         rect_iy = rect_iy + (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
    //         // rect_iy = rect_iy + y - clicky[0]
    //
    //
    //
    //         break
    //     case "nw":
    //         rect_ix = x;
    //         rect_w = rect_w - (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
    //         rect_iy = y;
    //         rect_h = rect_h - (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
    //         break
    //     case "se":
    //         rect_w = rect_w + (clickx[clickx.length - 1] - clickx[clickx.length - 2]);
    //         rect_h = rect_h + (clicky[clicky.length - 1] - clicky[clicky.length - 2]);
    //         break
    //     default:
    //         console.log("Unknown drawing rect_mode")
    // }
}

function select_draw(selected_draw_mode) {
    switch (selected_draw_mode) {
        case "draw_rect":
            // console.log("Drawing mode", selected_draw_mode)
            draw_mode = selected_draw_mode;
            break
        case "draw_stairs":
            // console.log("Drawing mode", selected_draw_mode)
            draw_mode = selected_draw_mode;
            break
        default:
            console.log("Unknown drawing mode to select", selected_draw_mode)
    }
}

// *****************88

function generalHandler(event) {
    console.log(event)
}
function cancel_handler(event) {}
function out_handler(event) {}
function leave_handler(event) {}
function gotcapture_handler(event) {}
function lostcapture_handler(event) {}
function over_handler(event) {}
function enter_handler(event) {}


function drawBGImage() {
    // console.log("drawBGImage")
    canvas = document.getElementById('sketch');
    context = canvas.getContext('2d');

    var canvasSize = Math.floor(0.75 * Math.min(window.innerWidth, window.innerHeight));
    canvas.setAttribute('width', canvasSize);
    // canvas.setAttribute('height', window.innerHeight);
    canvas.setAttribute('height', canvasSize);
    var img = new Image();
    img.src = '/static/bg.png';
    img.onload = function () {
        // context.fillStyle = "rgb(184,171,105)";
        // context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = boardColor;
        // context.fillStyle = "#FF0000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        // context.drawImage(img, 0, 0);
        // ctx.drawImage(img, 0, 0);
        // ctx.beginPath();
        // ctx.moveTo(30, 96);
        // ctx.lineTo(70, 66);
        // ctx.lineTo(103, 76);
        // ctx.lineTo(170, 15);
        ctx.stroke();
    };
    // img.src = '/static/bg.png'; // img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png';
}

/**
 - Encodes the image into a base 64 string.
 - Add the string to an hidden tag of the form so Flask can reach it.
 **/
function save() {
    // console.log('save running')
    // clear red lines
    // redraw();
    // showOnlyRect = true;
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    // context.strokeStyle = crectColor;
    // context.rect(
    //     rect_ix + (drugX - drugIX),
    //     rect_iy + (drugY - drugIY),
    //     rect_w - drugCornerW,
    //     rect_h - drugCornerH,
    // );
    // context.stroke();
    var image = new Image();
    var url = document.getElementById('url');
    image.id = "pic";
    image.src = canvas.toDataURL();
    url.value = image.src;
}