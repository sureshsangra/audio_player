const width = 500;
const startColor = {r: 255, g: 128, b: 0}; // unsigned byte values 0 - 255
const endColor = {r: 255, g: 128, b: 0};
var audio = document.getElementById('my-audio');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var height = Math.random() * 100 + 70;

function progressColor(start, end, progress) {
    const r = (end.r - start.r) * progress + start.r;
    const g = (end.g - start.g) * progress + start.g;
    const b = (end.b - start.b) * progress + start.b;
    return `rgb(${r | 0},${g |0 }, ${b | 0})`;
}


var progressAnimating = false;  // this is to avoid more that one mainLoop playing
function mainLoop() {
    ctx.clearRect(0,0,width,height);

    // draw backing bar here

    const fractionDone = audio.currentTime / audio.duration;
    progressBar(fractionDone);

    // only while not paused
    if (!audio.paused) {
        requestAnimationFrame(mainLoop);
    } else {
        progressAnimating = false;  // flag that the animation has stopped
    }
}

audio.addEventListener("play",() => {
    if (!progressAnimating) {
        requestAnimationFrame(mainLoop);
        progressAnimating = true;
    }
});

const barWidth = 2; // in px
const barSpacing = 4; // distance from left edge to next left edge in px

function progressBar(progress) {
    ctx.save(); // save the unclipped state

    ctx.beginPath(); // create the clip path
    ctx.rect(0,0, width * progress, height);
    ctx.clip();

    ctx.fillStyle =  progressColor(startColor, endColor, progress);

    ctx.beginPath(); // draw all bars as one
    var x = 0;
    while (x < width * progress) {
        ctx.rect(x, 0, barWidth, height);
        x += barSpacing;
    }
    ctx.fill(); // draw that bars

    ctx.restore(); // restore unclipped state
}

function equalizer(bar) {
    // Syntax: Math.random() * (max-min = range) + min;
    // My bars will be at least 70px, and at most 170px tall
    var height = Math.random() * 100 + 70;
    // Any timing would do the trick, mine is height times 7.5 to get a speedy yet bouncy vibe
    var timing = height * 7.5;
    // If you need to align them on a baseline, just remove this line and also the "marginTop: marg" from the "animate"
    var marg = (170 - height) / 2;
    
    bar.animate({
        height: height,
        marginTop: marg
    }, timing, function() {
        equalizer($(this));
    });
  }
  
  // Action on play-pause buttons can be added here (should be a wholesome function rather than annonymous)
  $('#canvas').each(function(i) {
    equalizer($(this));
  });