let firstClick = true;
const bombsHtml = document.querySelector(".bombsOnField");
let blocks = null;
let counterMine = 0;

const game = {
    width: 9,
    height: 9,
    countMine: 10,
    openCount: 0,
    field: [],
    fillMine: function () {
        this.field = [];
        for (let i = 0; i < this.width; i++) {
            let cells = [];
            for (let j = 0; j < this.height; j++) {
                cells.push(new Cell());
            }
            this.field.push(cells);
        }
        let i = 0;
        while (i < this.countMine) {
            const coordX = parseInt(Math.random() * this.width);
            const coordY = parseInt(Math.random() * this.height);
            if (!(this.field[coordX][coordY].hasMine)) {
                this.field[coordX][coordY].hasMine = true;
                i++;
            }
        }
    },
    findAlongsideMine: function (coordCellX, coordCellY) {
        const leftCornerX = coordCellX > 0 ? coordCellX - 1 : coordCellX;
        const leftCornerY = coordCellY > 0 ? coordCellY - 1 : coordCellY;
        const rightCornerX = coordCellX < this.width - 1 ? coordCellX + 1 : coordCellX;
        const rightCornerY = coordCellY < this.height - 1 ? coordCellY + 1 : coordCellY;
        let count = 0;

        for (let i = leftCornerX; i <= rightCornerX; i++) {
            for (let j = leftCornerY; j <= rightCornerY; j++) {
                if (this.field[i][j].hasMine && !(coordCellX === i && coordCellY === j)) {
                    count++;
                }
            }
        }
        this.field[coordCellX][coordCellY].mineAlongside = count;
    },
    startMainCounter: function () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.findAlongsideMine(x, y);
            }
        }
    },

    startGame: function () {
        this.openCount = 0;
        this.fillMine();
    }
};


const page = {
    init: function () {
        this.gameInterface.init();
        bombsHtml.innerHTML = game.countMine;
    },
    gameInterface: {
        table: null,
        addListener: true,
        flagCounts: game.countMine,
        init: function () {
            game.startGame();
            blocks = document.querySelector(".field");
            this.createField();
            const self = this;
            counterMine = game.countMine;
            if (this.addListener === true) {
                blocks.addEventListener("click", leftClick);
                blocks.addEventListener("contextmenu", rightClick);
            }

            function leftClick(event) {
                if (!(event.target.matches(".flag"))) {
                    self.clickCell(event);
                }
            }

            function rightClick(event) {
                self.flag(event);
            }

            this.addListener = false;

        },
        createField: function () {
            blocks.innerHTML = "";
            let table = document.createElement("table");
            this.table = table;
            for (let i = 0; i < game.height; i++) {
                let tr = document.createElement("tr");
                for (let j = 0; j < game.width; j++) {

                    let td = document.createElement("td");
                    if (game.field[j][i].hasMine) {
                        td.classList.add("bomber");
                    }

                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            blocks.appendChild(table);

        },
        showBombs: function () {
            let td = document.querySelectorAll(".bomber");
            for (let i = 0; i < td.length; i++) {
                td[i].classList.remove("bomber");
                td[i].classList.add("boom");
            }
        },

        clickCell: function (event) {
            const coordCellX = event.target.cellIndex;
            const coordCellY = event.target.parentNode.rowIndex;
            let td = this.table.rows[coordCellY].children[coordCellX];
            if (firstClick === true) {

                if (game.field[coordCellX][coordCellY].hasMine === true) {
                    td.classList.remove("bomber");
                    let i = 0;
                    while (i < 1) {
                        const coordMineX = parseInt(Math.random() * game.width);
                        const coordMineY = parseInt(Math.random() * game.height);
                        if (!(game.field[coordMineX][coordMineY].hasMine)) {
                            game.field[coordMineX][coordMineY].hasMine = true;
                            i++;
                            let td = this.table.rows[coordMineY].children[coordMineX];
                            td.classList.add("bomber");
                        }
                    }
                }
                game.field[coordCellX][coordCellY].hasMine = false;
                game.startMainCounter();
                firstClick = false;
            }
            this.openNearClick(coordCellX, coordCellY);
        },
        openNearClick: function (coordCellX, coordCellY) {
            const td = this.table.rows[coordCellY].children[coordCellX];
            if (game.field[coordCellX][coordCellY].notClicked || td.classList.contains("flag")) {
                return;
            }

            if (game.field[coordCellX][coordCellY].hasMine) {
                showModalLose();
                stopWatchs();
                this.showBombs();
                td.classList.add("dead");
                setTimeout(closeModalLose, 1250);
                firstClick = true;
                setTimeout(restart, 1300);
                return;
            }
            td.innerHTML = game.field[coordCellX][coordCellY].mineAlongside;
            game.field[coordCellX][coordCellY].notClicked = true;

            if (game.field[coordCellX][coordCellY].mineAlongside === 0) {
                for (let i = coordCellX > 0 ? coordCellX - 1 : coordCellX;
                     i <= coordCellX + 1 && i < game.width; i++) {
                    for (let j = coordCellY > 0 ? coordCellY - 1 : coordCellY;
                         j <= coordCellY + 1 && j < game.height; j++) {
                        this.openNearClick(i, j);
                        td.innerHTML = "";
                    }
                }
            }
            td.classList.remove("question");
            td.classList.add("clicked");

            game.openCount++;
            if ((game.width * game.height - game.countMine) === game.openCount) {
                showModalWin();
                setTimeout(closeModalWin, 1250);
                firstClick = true;
                setTimeout(restart, 1300);
            }

        },
        flag: function (event) {
            const coordClickX = event.target.cellIndex;
            const coordClickY = event.target.parentNode.rowIndex;
            if (game.field[coordClickX][coordClickY].notClicked) {
                return;
            }
            if (event.target.classList.contains("flag")) {
                counterMine++;
                event.target.classList.toggle("flag");
                event.target.classList.toggle("question");
            } else if (counterMine > 0 && !event.target.classList.contains("flag")
                && !event.target.classList.contains("question")) {
                event.target.classList.toggle("flag");
                counterMine--;
            } else if (counterMine > 0 && event.target.classList.contains("question")) {
                event.target.classList.toggle("question");
            } else if (counterMine === 0 && event.target.classList.contains("flag")) {
                event.target.classList.toggle("flag");
                counterMine++;
            } else if (counterMine === 0 && !event.target.classList.contains("flag")) {
                event.target.classList.toggle("question");
            }
            bombsHtml.innerHTML = counterMine;
            event.preventDefault();
        }

    }
};
page.init();


function Cell() {
    this.hasMine = false;
    this.mineAlongside = 0;
    this.notClicked = false;
}

function optionGame(row, column, mine) {
    stopWatchs();
    firstClick = true;
    game.width = column;
    game.height = row;
    game.countMine = mine;
    bombsHtml.innerHTML = mine;
    counterMine = mine;
    page.init();
}

function customOptionGame() {
    firstClick = true;
    stopWatchs();
    const allInputs = document.querySelectorAll("input");
    const row = allInputs[0];
    const column = allInputs[1];
    const mine = allInputs[2];
    if (mine.value >= (row.value * column.value) && (row.value * column.value) != 0) {
        const msg = row.value * column.value;
        alert(`При таких параметрах поля, количество мин должно быть меньше ${msg}`);
    }
    if (row.value >= 2 && column.value >= 2 && mine.value != 0
        && mine.value < (row.value * column.value)) {
        game.width = column.value;
        game.height = row.value;
        game.countMine = mine.value;
        bombsHtml.innerHTML = mine.value;
        counterMine = mine;
        page.init();
    }
}

function restart() {
    firstClick = true;
    counterMine = game.countMine;
    bombsHtml.innerHTML = counterMine;
    stopWatchs();
    game.startGame();
    page.gameInterface.createField();
}
