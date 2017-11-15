let firstClick  = true;
const bombsHtml = document.querySelector(".bombsOnField");
let blocks = null;
let count_mines = 0;

const game = {
    width: 9,
    height: 9,
    count_mine: 10,
    open_count: 0,
    field:[],
    fill_mine:function () {
        this.field = [];
        for(let i = 0; i < this.width; i++) {
            let Cells = [];
            for (let j = 0; j < this.height; j++) {
                Cells.push(new Cell());
            }
            this.field.push(Cells);
        }
        let i = 0;
        while (i < this.count_mine){
            const coordX = parseInt(Math.random() * this.width);
            const coordY = parseInt(Math.random() * this.height);
            if(!(this.field[coordX][coordY].has_mine)) {
                this.field[coordX][coordY].has_mine = true;
                i++;
            }
        }
    },
    find_alongside_mine :function (coordCellX, coordCellY) {
        const leftCornerX= coordCellX > 0 ? coordCellX - 1 : coordCellX;
        const leftCornerY = coordCellY > 0 ? coordCellY - 1 : coordCellY;
        const rightCornerX = coordCellX < this.width - 1 ? coordCellX + 1 : coordCellX;
        const rightCornerY = coordCellY < this.height - 1 ? coordCellY + 1 : coordCellY;
        let count = 0;

        for (let i = leftCornerX; i <= rightCornerX; i++ ) {
            for(let j = leftCornerY; j <= rightCornerY; j++) {
                if(this.field[i][j].has_mine && !(coordCellX === i && coordCellY === j)) {
                    count ++;
                }
            }
        }
        this.field[coordCellX][coordCellY].mineAlongside = count;
    },
    start_main_counter : function () {
        for(let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.find_alongside_mine(x,y);
            }
        }
    },

    start_game: function () {
        this.open_count = 0;
        this.fill_mine();
    }
};


const page = {
    init:function () {
        this.game_interface.init();
        bombsHtml.innerHTML = game.count_mine;
    },
    game_interface: {
        table:null,
        addListener:true,
        flagCounts: game.count_mine,
        init:function () {
            game.start_game();
            blocks = document.querySelector(".field");
            this.create_field();
            const self = this;
            count_mines = game.count_mine;
            if(this.addListener === true) {
                blocks.addEventListener("click", leftClick);
                blocks.addEventListener("contextmenu",rightClick);
            }
            function leftClick(event) {
                if(!(event.target.matches(".flag"))) {
                    self.click_cell(event);
                }
            }

            function rightClick(event) {
                self.flag(event);
            }
            this.addListener = false;

        },
        create_field:function () {
            blocks.innerHTML = "";
            let table = document.createElement("table");
            this.table = table;
            for(let i = 0; i < game.height; i++)
            {
                let tr = document.createElement("tr");
                for (let j = 0; j < game.width; j++) {

                    let td = document.createElement("td");
                    if(game.field[j][i].has_mine) td.classList.add("bomber");

                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            blocks.appendChild(table)

        },
        show_bombs : function () {
            let td = document.querySelectorAll(".bomber");
            for(let i = 0; i < td.length; i++) {
                td[i].classList.remove("bomber");
                td[i].classList.add("boom");
            }
        },

        click_cell: function (e) {
            const coordCellX =  e.target.cellIndex;
            const coordCellY = e.target.parentNode.rowIndex;
            let td = this.table.rows[coordCellY].children[coordCellX];
            if (firstClick === true) {
                if(game.field[coordCellX][coordCellY].has_mine === true) {
                    td.classList.remove("bomber");
                    let i = 0;
                    while (i < 1) {
                        const coordMineX = parseInt(Math.random() * game.width);
                        const coordMineY = parseInt(Math.random() * game.height);
                        if(!(game.field[coordMineX][coordMineY].has_mine)) {
                            game.field[coordMineX][coordMineY].has_mine = true;
                            i++;
                            let td = this.table.rows[coordMineY].children[coordMineX];
                            td.classList.add("bomber");
                        }
                    }
                }
                game.field[coordCellX][coordCellY].has_mine = false;
                game.start_main_counter();
                firstClick = false;
            }
            this.open_near_click(coordCellX,coordCellY);
        },
        open_near_click: function (coordCellX, coordCellY) {
            const td = this.table.rows[coordCellY].children[coordCellX];
            if(game.field[coordCellX][coordCellY].not_clicked) {
                return;
            }
            if(td.classList.contains("flag")) {
                return;
            }
            if(game.field[coordCellX][coordCellY].has_mine){
                showModalLose();

                this.show_bombs();
                td.classList.add("dead");
                setTimeout(closeModalLose,1250);
                firstClick = true;
                setTimeout(restart,1300);
            }else{


                td.innerHTML = game.field[coordCellX][coordCellY].mineAlongside;
                game.field[coordCellX][coordCellY].not_clicked = true;

                if(game.field[coordCellX][coordCellY].mineAlongside === 0 ) {
                    for (let i = coordCellX > 0 ? coordCellX - 1 : coordCellX; i <= coordCellX + 1 && i < game.width; i++ ) {
                        for(let j = coordCellY > 0 ? coordCellY - 1 : coordCellY; j <= coordCellY + 1 && j < game.height ; j++) {
                            this.open_near_click(i, j);
                            td.innerHTML = "";
                        }
                    }
                }
                td.classList.remove("question");
                td.classList.add("clicked");


                game.open_count ++;
                if((game.width * game.height - game.count_mine) === game.open_count) {
                    showModalWin();
                    setTimeout(closeModalWin,1250);
                    firstClick = true;
                    setTimeout(restart,1300);
                }
            }
        },
        flag : function (e) {
            const coordClickX =  e.target.cellIndex;
            const coordClickY = e.target.parentNode.rowIndex;
            if(game.field[coordClickX][coordClickY].not_clicked) return;

            if(e.target.classList.contains("flag")){
                count_mines ++;
                e.target.classList.toggle("flag");
                e.target.classList.toggle("question");
            } else if(count_mines > 0 && !e.target.classList.contains("flag") && !e.target.classList.contains("question")) {
                e.target.classList.toggle("flag");
                count_mines --;
            }else if(count_mines > 0 && e.target.classList.contains("question")) {
                e.target.classList.toggle("question");
            }else if(count_mines === 0 && e.target.classList.contains("flag") ){
                e.target.classList.toggle("flag");
                count_mines ++;
            } else if(count_mines === 0 && !e.target.classList.contains("flag") ){
                e.target.classList.toggle("question");
            }
            bombsHtml.innerHTML = count_mines;
            e.preventDefault();
        },

    }
};
page.init();


function Cell() {
    this.has_mine = false;
    this.mineAlongside = 0;
    this.not_clicked = false;
}

function optionGame(row, column, mine) {
    ClearСlock();
    firstClick = true;
    game.width = column;
    game.height = row;
    game.count_mine = mine;
    bombsHtml.innerHTML = mine;
    count_mines = mine;
    page.init();
}

function customOptionGame() {
    ClearСlock();
    firstClick = true;
    const allInputs = document.querySelectorAll("input");
    const row = allInputs[1];
    const column = allInputs[2];
    const mine = allInputs[3];
    if (mine.value >= (row.value * column.value) && (row.value * column.value) != 0) {
        const msg = row.value * column.value;
        alert(`При таких параметрах поля, количество мин должно быть меньше ${msg}`);
    }
    if(row.value >= 2 && column.value >= 2 && mine.value != 0
        && mine.value < (row.value * column.value)  ) {
        game.width = column.value;
        game.height = row.value;
        game.count_mine = mine.value;
        bombsHtml.innerHTML = mine.value;
        count_mines = mine;
        page.init();
    }
}

function restart() {
    ClearСlock();
    firstClick = true;
    count_mines = game.count_mine;
    bombsHtml.innerHTML = count_mines;
    game.start_game();
    page.game_interface.create_field();

}
