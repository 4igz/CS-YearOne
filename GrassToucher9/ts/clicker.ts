// ok✅✅
let grass = document.getElementById("grass-btn")!;
var mX: number = 0, mY: number = 0;
var clicks = 0;

const milestones = {
    '10': "Keep going.",
    '50': "Sunlight is the best medicine.",
    '100': "You're doing great.",
    '150': "Don't you feel better already?"
} as const

function milestoneMessage(): string {
    var highest: number = 0;
    var message: string = "";
    for (let k in milestones) {
        let click_milestone = parseInt(k);
        if (!(clicks >= click_milestone)) continue;
        if (click_milestone > highest) {
            highest = click_milestone;
            message = milestones[k];
        };
    };
    return message;
}

function dropSun(sun: HTMLElement, height: number): boolean {
    sun.style.top = `${++height}px`;

    let current_opacity = parseFloat(sun.style.opacity);
    if (isNaN(current_opacity)) {
        current_opacity = 1.0;
        sun.style.opacity = `${current_opacity}`;
    }

    if (height >= 100) {
        if (current_opacity <= 0.0) {
            document.body.removeChild(sun);
            return false;
        }
        current_opacity -= 0.005;
        sun.style.opacity = `${current_opacity}`;
    }
    return true;
}

const newFallingSun = () => {
    let sun = document.createElement('falling-sun');
    const INIT_HEIGHT = -50;
    sun.id = "falling-sun";
    sun.style.top = `${INIT_HEIGHT}px`;
    sun.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(sun);

    while (true) {

        if (!dropSun(sun, INIT_HEIGHT)) { break }

    }
}

var handleMouseMove = (event: MouseEvent) => {
    mX = event.pageX;
    mY = event.pageY;
}

window.onload = () => {
    document.onmousemove = handleMouseMove;
    grass.onclick = () => {
        var message_box = document.getElementById("message-box")!;
        var text_counter = document.getElementById("counter")!;
        clicks++;
        message_box.innerHTML = milestoneMessage();
        text_counter.innerHTML = `Touched the grass ${clicks} ${clicks == 1 ? "time" : "times"}.`;
        newFallingSun();
    };
}
