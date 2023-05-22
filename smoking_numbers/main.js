//ok✅✅
const TIME_BETWEEN_Qs_MS = 1000;
const TIME_PER_LEVEL = 30;
const SKIPS_PER_LEVEL = 2;
const LEVEL_INC = 2;
const OPS = [
    "+",
    "-",
    "*",
    "/",
];

var regenEqButton = document.getElementById("regen-button");
var numberGrid = document.getElementById("number-grid");
var numberGridChildren = numberGrid.getElementsByTagName("*");
var highscoreText = document.getElementById("highscore-text");
var eqIfr = document.getElementById("equation-iframe");
var lvlTimerBar = document.getElementById("timer-bar");
var lvlTimer = document.getElementById("level-timer");
var equation = document.getElementById("equation");
var lvlTxt = document.getElementById("level-text");
var input = document.getElementById("input");
var ifrDoc = eqIfr.contentDocument;
var answer = generateEquation();

var acceptInput = true;
var currentLevel = 1;
var skipsThisLevel = 0;
var timeLeft = TIME_PER_LEVEL;
var highscore = currentLevel;

function getAnswer(op, t1, t2) {
    switch (op) {
        case "+":
            return t1 + t2;
        case "-":
            return t1 - t2;
        case "*":
            return t1 * t2;
        case "/":
            return t1 / t2;
    }
}

function getRandomOperand() {
    return OPS[Math.floor(Math.random() * (OPS.length))];
}

function randomTerm() {
    var t = Math.ceil(Math.random() * (LEVEL_INC * (currentLevel | 1)));
    return t;
}

function generateEquation() {
    var op = getRandomOperand();
    var t1 = randomTerm();
    var t2 = randomTerm();

    if (op == "/") {
        t1 = t2 * Math.ceil(Math.random() * 10);
    }
    equation.textContent = t1.toString() + " " + op + " " + t2.toString() + " =";
    return getAnswer(op, t1, t2);
}

function regenEquation() {
    // Set up next equation
    answer = generateEquation();
    acceptInput = true;

    lvlTxt.textContent = "Level: " + currentLevel.toString();
    equation.style.color = "azure";
    input.style.color = "azure";
    input.textContent = "";
}

function skipThisQuestion() {
    if (skipsThisLevel >= SKIPS_PER_LEVEL) {
        return;
    }
    skipsThisLevel++;
    regenEquation();
    if (skipsThisLevel >= SKIPS_PER_LEVEL) {
        regenEqButton.style.color = "red";
        return;
    }
}

function countdownTimer() {
    setTimeout(() => {
        if (currentLevel > 1) {
            timeLeft--;
            if (timeLeft <= 0) {
                timeLeft = TIME_PER_LEVEL;
                currentLevel = 1;
                regenEquation();
            }
            lvlTimer.textContent = "Time Left: " + timeLeft;
            lvlTimerBar.style.width = (timeLeft / TIME_PER_LEVEL) * 100 + "%";
        }
        countdownTimer();
    }, 1000);
}


function registerButton(e) {
    var text = e.textContent;
    e.onclick = (_evt) => {
        document.onkeydown({ 'key': text });
    }
}

function validateInput(itc) {
    // Check for wrong answers
    if (itc.substring(0, itc.length) !== answer.toString().substring(0, itc.length)) {
        equation.style.color = "red";
        input.style.color = "red";
    } else {
        equation.style.color = "azure";
        input.style.color = "azure";
    }
}

countdownTimer();
regenEqButton.onclick = skipThisQuestion;

for (i = 0; i < numberGridChildren.length; ++i) {
    var e = numberGridChildren[i];
    registerButton(e);
}

document.onkeydown = (evt) => {
    if (!acceptInput) {
        return;
    }
    var itc = input.textContent;
    if (evt.key == "CLR") {
        input.textContent = "";
    }
    if (evt.key == "Backspace") {
        input.textContent = itc.substring(0, itc.length - 1);
    }
    if (evt.key == "-") {
        input.textContent = "-";
    }

    validateInput(input.textContent);

    // Only allow numbers to be entered if not handled previously
    if (isNaN(parseInt(evt.key))) {
        return;
    }
    input.textContent += evt.key;

    validateInput(input.textContent);

    if (input.textContent == answer.toString()) {
        equation.style.color = "lime";
        input.style.color = "lime";
        acceptInput = false;
        timeLeft = TIME_PER_LEVEL;

        setTimeout(() => {
            currentLevel++;

            if (currentLevel > highscore) {
                highscore = currentLevel;
                highscoreText.textContent = "Highscore: " + highscore.toString();
            }

            skipsThisLevel = 0;
            regenEqButton.style.color = "black";
            regenEquation();
        }, TIME_BETWEEN_Qs_MS)

        // Shows answers in scrolling frame
        // Only works the first time. If you refresh the page it breaks.
        var scrolling = ifrDoc.getElementById("scrolling");
        var eq = ifrDoc.createElement("h2");
        eq.textContent = equation.textContent + " " + answer.toString();
        scrolling.insertBefore(eq, scrolling.firstChild);
    }
}