// mouse
var mouseX;
var mouseY;

// context
var canvas;
var context;

// red dots
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();


// rect
var rectIX = 0;
var rectIY = 0;
var rectW = 0;
var rectH= 0;
var rectX = new Array();
var rectY = new Array();

// drag
var drugIX = 0;
var drugIY = 0;
var drugX = 0;
var drugY= 0;

var clickDragRectX = new Array();
var clickDragRectY = new Array();

var dragRect = false;
var dragRectX = new Array();
var dragRectY = new Array();

// corners
var rectNWX = 0;
var rectNWY = 0;
var rectSEX = 0;
var rectSEY = 0;
var distanceFromCorner = 40; // 5 px from in any direction
var drugCorner = "";
var drugCornerIX = 0;
var drugCornerIY = 0;
var drugCornerW = 0;
var drugCornerH = 0;


// colors
var paint = false;
var curColor = "#FF5733";
var crectColor = "#3357ff";

function checkNear(pointX, pointY, mouseX, mouseY) {
    return ((pointX - mouseX) **2 + (pointY - mouseY) **2) < distanceFromCorner **2
}

/**
 - Clear the canvas and redraw
 **/
function redraw() {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = curColor;
    context.lineJoin = "round";
    context.lineWidth = 3;
    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
    context.strokeStyle = crectColor;
    // console.log(rectX[0], clickY[0], rectX[rectX.length - 1], clickY[clickY.length -1 ]);

    // // dragRectX, dragRectY
    // if (dragRect){
    //     dragRectX = clickDragRectX[clickDragRectX.length - 1] - clickDragRectX[0]
    //     dragRectY = clickDragRectY[clickDragRectY.length - 1] - clickDragRectY[0]
    // } else {
    //     dragRectX = 0
    //     dragRectY = 0
    // }

    context.rect(
        rectIX + (drugX - drugIX),
        rectIY + (drugY - drugIY),
        rectW - drugCornerW,
        rectH - drugCornerH,

    );
    context.stroke();

}

/**
 - Saves the click postition
 **/
function addClick(x, y, dragging) {
    // console.log("dragRect")
    // console.log(dragRect)

    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);

    if (drugCorner === "NW") {
        rectIX = x;
        rectIY = y;
        drugCornerW = (x - drugCornerIX);
        drugCornerH = (y - drugCornerIY);
        // rectH = rectH - (y - drugCornerIY);

    }

    else if (dragRect) {
        drugX = x;
        drugY = y;

    } else {
        rectW = x - rectIX;
        rectH = y - rectIY;
    }
}


function over_handler(event) {
}

function enter_handler(event) {
}

function down_handler(e) {

        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;

        // count current corners
        rectNWX = Math.min(rectIX, rectIX + rectW);
        rectNWY = Math.min(rectIY, rectIY + rectH);

        rectSEX = Math.max(rectIX, rectIX + rectW);
        rectSEY = Math.max(rectIY, rectIY + rectH);

        // checkNear(rectNWX, rectNWY, mouseX, mouseY)
        // checkNear(rectSEX, rectSEY, mouseX, mouseY)

        //
        if (
            checkNear(rectNWX, rectNWY, mouseX, mouseY)
        ) {
            console.log("catch corner rectNW");
            console.log(rectNWX, rectNWY, mouseX, mouseY, distanceFromCorner);

            dragRect = false;
            drugCorner = "NW";
            drugCornerIX = mouseX;
            drugCornerIY = mouseY;

        } else  if (
            // mouseX < rectX[0] || mouseX > rectX[rectX.length - 1] //|| mouseY < rectY[0] || mouseY < rectY[rectY.length - 1]
            mouseX < Math.min(rectIX, rectIX + rectW)
            || mouseX > Math.max(rectIX, rectIX + rectW) //|| mouseY < rectY[0] || mouseY < rectY[rectY.length - 1]
            || mouseY < Math.min(rectIY, rectIY + rectH)
            || mouseY > Math.max(rectIY, rectIY + rectH)

        ) {
            // console.log("reset rect");
            dragRect = false;
            rectIX = mouseX;
            rectIY = mouseY;
            drugIX = drugX;
            drugIY = drugY;
        } else {
            // console.log("reset drag");
            dragRect = true;
            drugIX = mouseX;
            drugIY = mouseY;
        }



        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();

}

function move_handler(e) {
            if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
}

function up_handler(e) {

        paint = false;
        dragRect = false;
        drugCorner = "";

        // rearrange rect
        rectIX = Math.min(rectIX, rectIX + rectW);
        rectIY = Math.min(rectIY, rectIY + rectH);

        rectW = Math.abs(rectW);
        rectH = Math.abs(rectH);
        drugCornerW = 0;
        drugCornerH = 0;

        console.log(e)
}

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

    el.onpointerover = generalHandler;
    el.onpointerenter = generalHandler;
    // el.onpointerdown = generalHandler;
    // el.onpointermove = generalHandler;
    // el.onpointerup = generalHandler;
    el.onpointercancel = generalHandler;
    el.onpointerout = generalHandler;
    el.onpointerleave = generalHandler;
    el.gotpointercapture = generalHandler;
    el.lostpointercapture = generalHandler;
}

function drawBGImage () {
    console.log("drawBGImage")

    canvas = document.getElementById('sketch');
    context = canvas.getContext('2d');

    var img = new Image();
    img.src = '/static/bg.png';

    img.onload = function () {
        // context.fillStyle = "#f5f5dc";
        // context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        // ctx.drawImage(img, 0, 0);
        // ctx.beginPath();
        // ctx.moveTo(30, 96);
        // ctx.lineTo(70, 66);
        // ctx.lineTo(103, 76);
        // ctx.lineTo(170, 15);
        // ctx.stroke();
    };
    // img.src = '/static/bg.png'; // img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png';
}