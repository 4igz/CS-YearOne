// ok✅✅
var grass = document.getElementById("grass-btn");
var mX = 0, mY = 0;
var clicks = 0;
var milestones = {
    '10': "Keep going.",
    '50': "Sunlight is the best medicine.",
    '100': "You're doing great.",
    '150': "Don't you feel better already?"
};
function milestoneMessage() {
    var highest = 0;
    var message = "";
    for (var k in milestones) {
        var click_milestone = parseInt(k);
        if (!(clicks >= click_milestone))
            continue;
        if (click_milestone > highest) {
            highest = click_milestone;
            message = milestones[k];
        }
        ;
    }
    ;
    return message;
}
function dropSun(sun, height) {
    sun.style.top = "".concat(++height, "px");
    var current_opacity = parseFloat(sun.style.opacity);
    if (isNaN(current_opacity)) {
        current_opacity = 1.0;
        sun.style.opacity = "".concat(current_opacity);
    }
    if (height >= 100) {
        if (current_opacity <= 0.0) {
            document.body.removeChild(sun);
            return false;
        }
        current_opacity -= 0.005;
        sun.style.opacity = "".concat(current_opacity);
    }
    return true;
}
var newFallingSun = function () {
    var sun = document.createElement('falling-sun');
    var INIT_HEIGHT = -50;
    sun.id = "falling-sun";
    sun.style.top = "".concat(INIT_HEIGHT, "px");
    sun.style.left = "".concat(Math.random() * window.innerWidth, "px");
    document.body.appendChild(sun);
    while (true) {
        if (!dropSun(sun, INIT_HEIGHT)) {
            break;
        }
    }
};
var handleMouseMove = function (event) {
    mX = event.pageX;
    mY = event.pageY;
};
window.onload = function () {
    document.onmousemove = handleMouseMove;
    grass.onclick = function () {
        var message_box = document.getElementById("message-box");
        var text_counter = document.getElementById("counter");
        clicks++;
        message_box.innerHTML = milestoneMessage();
        text_counter.innerHTML = "Touched the grass ".concat(clicks, " ").concat(clicks == 1 ? "time" : "times", ".");
        newFallingSun();
    };
};
