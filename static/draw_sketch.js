console.log("Im loaded")

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


// $('#canvas').addEventListener('touchstart', process_touchstart, false);
// $('#canvas').addEventListener('touchmove', process_touchmove, false);
// $('#canvas').addEventListener('touchcancel', process_touchcancel, false);
// $('#canvas').addEventListener('touchend', process_touchend, false);




/**
 - Preparing the Canvas : Basic functions
 **/
function drawCanvas() {

    canvas = document.getElementById('canvas');
    context = document.getElementById('canvas').getContext("2d");

    var img = new Image();
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
    img.src = '/static/bg.png'; // img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png';


    // $('#canvas').addEventListener('touchstart', touchEvent, false);
    // $('#canvas').addEventListener('touchmove', touchEvent, false);
    // $('#canvas').addEventListener('touchcancel', touchEvent, false);
    // $('#canvas').addEventListener('touchend', touchEvent, false);

    function touchstart(e) {
        e.preventDefault();
        console.log("Im touch")
    }


    function touchEvent(e) {
        e.preventDefault();
        console.log("Im touch")
    }


    $('#canvas').mousedown(function (e) {
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
    });

    $('#canvas').mousemove(function (e) {
    // $('#canvas').touchmove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    $('#canvas').mouseup(function (e) {
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

    });
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
 - Encodes the image into a base 64 string.
 - Add the string to an hidden tag of the form so Flask can reach it.
 **/
function save() {
    var image = new Image();
    var url = document.getElementById('url');
    image.id = "pic";
    image.src = canvas.toDataURL();
    url.value = image.src;
}


function drawSmileCanvas() {
    console.log("drawCanvas loaded")

    // var canvas = document.getElementById('sketch');
    // if (canvas.getContext) {
    //     var ctx = canvas.getContext('2d');
    //
    //     // draw house
    //     // ctx.fillStyle = 'rgb(200, 0, 0)';
    //     // ctx.fillRect(10, 10, 50, 50);
    //     //
    //     // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    //     // ctx.fillRect(30, 30, 50, 50);
    //
    //
    //     ctx.beginPath();
    //     ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    //     ctx.moveTo(110, 75);
    //     ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
    //     ctx.moveTo(65, 65);
    //     ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
    //     ctx.moveTo(95, 65);
    //     ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
    //     ctx.stroke();
    //
    // }
    //
    // console.log(sketch)
    // console.log(ctx)
}