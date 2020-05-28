// // mouse
// var mousex;
// var mousey;

// context
var canvas;
var context;
// var showOnlyRect = false;

// red dots
var clickx = new Array();
var clicky = new Array();
var clickDrag = new Array();

// draw mode: new, drug, corners: nw, se, etc
var mode = "";

// rect
var rect_ix = 0;
var rect_iy = 0;
var rect_w = 0;
var rect_h = 0;
// var rectX = new Array();
// var rectY = new Array();

// drag
// var drag = "";
// var drugIX = 0;
// var drugIY = 0;
// var drugX = 0;
// var drugY = 0;

// var clickDragRectX = new Array();
// var clickDragRectY = new Array();

// var dragRect = false;
// var dragRectX = new Array();
// var dragRectY = new Array();

// corners
// var rectNWX = 0;
// var rectNWY = 0;
// var rectSEX = 0;
// var rectSEY = 0;
var distanceFromCorner = 10; // 5 px from in any direction
// var drugCorner = "";
// var drugCornerIX = 0;
// var drugCornerIY = 0;
// var drugCornerW = 0;
// var drugCornerH = 0;


// colors
var paint = false;
var curColor = "#FF5733";
var rectColor = "#3357ff";


function init() {
    console.log("init")
    var el = document.getElementById("sketch");
    // Register pointer event handlers
    // el.onpointerover = over_handler;
    // el.onpointerenter = enter_handler;
    el.onpointerdown = down_handler;
    el.onpointermove = move_handler;
    el.onpointerup = up_handler;
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

function checkOutside(mousex, mousey) {
    return     (
        mousex < rect_ix
        || mousex > rect_ix + rect_w
        || mousey < rect_iy
        || mousey > rect_iy + rect_h
    )
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

    // re-draw path

    // context.strokeStyle = curColor;
    // context.lineJoin = "round";
    // context.lineWidth = 3;
    // for (var i = 0; i < clickx.length; i++) {
    //     context.beginPath();
    //     if (clickDrag[i] && i) {
    //         context.moveTo(clickx[i - 1], clicky[i - 1]);
    //     } else {
    //         context.moveTo(clickx[i] - 1, clicky[i]);
    //     }
    //     context.lineTo(clickx[i], clicky[i]);
    //     context.closePath();
    //     context.stroke();
    // }
    // if (showOnlyRect) {
    //     context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    // }

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

/**
 - Saves the click postition
 **/
function addClick(x, y, dragging) {

    console.log("draw - addClick mode ->", mode)
    // console.log(mode)
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
    switch (mode){
        case "new":
            // console.log("draw - addClick new")

            rect_ix = clickx[0];
            rect_iy = clicky[0];

            rect_w = clickx[clickx.length - 1] - clickx[0]
            rect_h = clicky[clicky.length - 1] - clicky[0]

            break
        case "drug":
            // console.log("draw - addClick -drug ")
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
            console.log("Unknown drawing mode")


    }


}

function down_handler(e) {
    console.log("draw - down_handler")
    console.log(e.pageX, this.offsetLeft, e.pageX - this.offsetLeft)
    console.log(e.pageY, this.offsetTop, e.pageY - this.offsetTop)


    var mousex = e.pageX - this.offsetLeft;
    var mousey = e.pageY - this.offsetTop;

    console.log(mousex, mousey)



    // clear mouse history
    clickx = [];
    clicky = [];

    paint = true;

    // detect painting mode
    // new or drug existent rect?
    if (checkOutside(mousex, mousey)) {
        mode = "new";

        rect_w = 0;
        rect_h = 0;

    } else {
        console.log("drug");
        console.log(mousex, mousey);
        
        clickx.push(mousex);
        clicky.push(mousey);

        mode = "drug";
    }

    // // ... or drug corner?
    if (
        checkNear(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
    ) {
        console.log("check se")
        console.log(rect_ix + rect_w, rect_iy + rect_h, mousex, mousey)
        mode = "se";
    } else if (

        checkNear(rect_ix, rect_iy, mousex, mousey)
    ) {
        console.log("check nw")
        console.log(rect_ix, rect_iy, mousex, mousey, checkNear(rect_ix, rect_iy, mousex, mousey))
        mode = "nw";
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




    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();

}

function move_handler(e) {
    // console.log("draw - move_handler")

    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
}

function up_handler(e) {
    console.log("draw - up_handler");
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
        console.log("rect became  NaN");
        rect_ix = 0;
        rect_iy = 0;
        rect_w = 0;
        rect_h = 0;
        console.log("rect restored to zero");
    }
    
    console.log("rect rearrenged to: ", rect_ix, rect_iy, rect_w, rect_h)


    // clickx = [];
    // clicky = [];

}


// *****************88


function cancel_handler(event) {
}

function out_handler(event) {
}

function leave_handler(event) {
}

function gotcapture_handler(event) {
}

function lostcapture_handler(event) {
}

function generalHandler(event) {
    console.log(event)
}

function over_handler(event) {
}

function enter_handler(event) {
}


function drawBGImage() {


    console.log("drawBGImage")

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

        context.fillStyle = "rgba(232,230,215,0.5)";
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