var sellButton = document.getElementById("fruit-sale-button");
var moneyCounter = document.getElementById("money-counter");
var upgradeButton = document.getElementById("upgrade-button");

var currentFruit = 0;
var currentMoney = 0;

var FRUIT_NAME = 0;
var FRUIT_COST = 1;
var FRUIT_PROFIT = 2;
var FRUIT_TYPES = [
    ["Fruit", 0, 1],
    ["Grapes", 10, 2.5],
    ["Tangerines", 100, 5],
    ["Grapefruit", 500, 7],
    ["GMO Fruit", 1000, 10],
];

function getNextUpgrade() {
    var nextFruit = FRUIT_TYPES[currentFruit + 1];
    return nextFruit;
}

function canUpgrade() {
    var nextFruit = getNextUpgrade();
    if (currentMoney >= nextFruit[FRUIT_COST]) {
        return true;
    }
    return false;
}

function updateMoneyCounter() {
    moneyCounter.textContent = 'Fruit Sale Cash: $' + currentMoney;
}

sellButton.onclick = function (_) {
    currentMoney += FRUIT_TYPES[currentFruit][FRUIT_PROFIT];
    updateMoneyCounter();
    if (canUpgrade()) {
        upgradeButton.style.backgroundColor = "green";
    }
};

upgradeButton.onclick = function (_) {
    if (!canUpgrade()) {
        return;
    }

    var nextFruit = getNextUpgrade();
    currentMoney -= nextFruit[FRUIT_COST];
    currentFruit += 1
    updateMoneyCounter();

    if (!canUpgrade()) {
        upgradeButton.style.backgroundColor = "red";
    }
};
