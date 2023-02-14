const HAND_TRACKER = document.getElementById("hand-tracker");
const BULLETS = document.getElementById("bullets");
const MIDDLE_SCREEN_H = window.innerHeight / 2;
const MIDDLE_SCREEN_W = window.innerWidth / 2;
const FAR_RIGHT_SCREEN = window.innerWidth;
const BOTTOM_SCREEN = window.innerHeight;
const THINK_MILLIS = 100;
const ATTACK_RANGE = 25;
const BULLET_SZ = 20;
const BULLET_SPEED = 2;
const SPEED_MOD = 3;
var mX = MIDDLE_SCREEN_W, mY = MIDDLE_SCREEN_W;
var projectile_tracker = [];
var HandState;
(function (HandState) {
    HandState[HandState["Idle"] = 0] = "Idle";
    HandState[HandState["Pointing"] = 1] = "Pointing";
    HandState[HandState["Chasing"] = 2] = "Chasing";
})(HandState || (HandState = {}));
class Player {
}
// A vector which takes two components, an X and a Y position measured in pixels.
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get normalized() {
        var len = this.len;
        if (len > 0) {
            let recipLen = 1 / len;
            return new Vec2(this.x * recipLen, this.y * recipLen);
        }
    }
    // essentially the distance between two vectors
    magnitude(to) {
        return Math.sqrt((Math.pow((to.x - this.x), 2)) + (Math.pow((to.y - this.y), 2)));
    }
    get len() {
        return Math.sqrt(this.dot(this));
    }
    dot(to) {
        return this.x * to.x + this.y * to.y;
    }
    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    sub_immut(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
    mul_immut(n) {
        return new Vec2(this.x * n, this.y * n);
    }
}
function getDirUnit(from, to) {
    return from.sub_immut(to).normalized;
}
function mV() {
    return new Vec2(mX, mY);
}
class Projectile {
    constructor(starting_pos, end_pos, damage, color) {
        this.damage = 10;
        this.proj_el = document.createElement("img");
        this.proj_el.className = "projectile";
        this.proj_el.style.color = color || "red";
        this.proj_el.style.left = starting_pos.x + "px";
        this.proj_el.style.top = starting_pos.y + "px";
        this.pos = starting_pos;
        // Normalizing allows me to keep the direction so when I multiply, 
        // it creates a unit ray in that direction.
        this.end = end_pos.normalized.mul_immut(2000);
        console.log(this.pos, this.end);
        this.dir = getDirUnit(this.pos, this.end);
        this.damage = damage || this.damage;
        BULLETS.appendChild(this.proj_el);
    }
    step_path() {
        this.pos.sub(this.dir.mul_immut(BULLET_SPEED));
    }
    check_mouse_collision() {
        var dist = this.pos.magnitude(mV());
        if (dist <= BULLET_SZ) {
            console.log("Player hit by bullet");
        }
        return false;
    }
}
class Hand {
    constructor(pos) {
        this.state = HandState.Idle;
        this.stage = 0;
        this.hand_el = document.createElement("img");
        this.hand_el.className = "hand";
        this.hand_el.id = "idle-hand";
        this.hand_el.style.left = pos.x + "px";
        this.hand_el.style.top = pos.y + "px";
        this.pos = pos;
        HAND_TRACKER.appendChild(this.hand_el);
    }
    // Move the HtmlElement to the set pos.
    update_element() {
        this.hand_el.style.left = (this.pos.x - (ATTACK_RANGE * 3)) + "px";
        this.hand_el.style.top = (this.pos.y - (ATTACK_RANGE * 1.5)) + "px";
    }
    move_to_cursor() {
        this.pos.sub(getDirUnit(this.pos, mV()));
    }
    try_attack() {
        let dist_to_cursor = this.pos.magnitude(mV());
        if (dist_to_cursor <= ATTACK_RANGE) {
        }
        else if (dist_to_cursor >= ATTACK_RANGE * 2) {
            // Start blasting
            let proj = new Projectile(this.pos, mV());
            projectile_tracker.push(proj);
        }
    }
}
window.onmousemove = (e) => {
    mX = e.pageX;
    mY = e.pageY;
};
window.onload = () => {
    const INIT_HAND_POS = new Vec2(MIDDLE_SCREEN_W, MIDDLE_SCREEN_H);
    let hand = new Hand(INIT_HAND_POS);
    setInterval(() => {
        for (let index = 0; index < SPEED_MOD; index++) {
            hand.move_to_cursor();
            hand.update_element();
            hand.try_attack();
        }
    }, THINK_MILLIS);
    // setInterval(() => {
    // projectile_tracker.forEach((proj: Projectile) => {
    // proj.step_path();
    // proj.check_mouse_collision();
    //     })
    // }, THINK_MILLIS * 2)
};
