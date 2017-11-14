let firstClick  = true;
let bombsHtml = document.querySelector(".bombsOnField");
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
            let bufferArr = [];
            for (let j = 0; j < this.height; j++) {
                bufferArr.push(new Cell());
            }
            this.field.push(bufferArr);
        }
        for (let i = 0; i < this.count_mine;){
            let coordMineX = parseInt(Math.random() * this.width);
            let coordMineY = parseInt(Math.random() * this.height);
            if(!(this.field[coordMineX][coordMineY].has_mine)) {
                this.field[coordMineX][coordMineY].has_mine = true;
                i++;
            }
        }
    },
    find_alongside_mine :function (coordCellX, coordCellY) {
        let x_left = coordCellX > 0 ? coordCellX - 1 : coordCellX;
        let y_left = coordCellY > 0 ? coordCellY - 1 : coordCellY;
        let x_right = coordCellX < this.width - 1 ? coordCellX + 1 : coordCellX;
        let y_right = coordCellY < this.height - 1 ? coordCellY + 1 : coordCellY;
        let count = 0;

        for (let i = x_left; i <= x_right; i++ ) {
            for(let j = y_left; j <= y_right; j++) {
                if(this.field[i][j].has_mine && !(coordCellX === i && coordCellY === j)) count ++;
            }
        }
        this.field[coordCellX][coordCellY].mineAlongside = count;
    },
    start_main_counter : function () {
        for(let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.find_alongside_mine(i,j);
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
            let self = this;
            count_mines = game.count_mine;
            if(this.addListener === true) {
                blocks.addEventListener("click", leftClick);
                blocks.addEventListener("contextmenu",rightClick);
            }
            function leftClick(event) {
                if(event.target.matches("td")  && !(event.target.matches(".flag"))) {
                    self.click_cell(event);
                }
            }

            function rightClick(event) {
                if(event.target.matches("td")) self.flag(event);
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
            x =  e.target.cellIndex;
            y = e.target.parentNode.rowIndex;
            let td = this.table.rows[y].children[x];
            if (firstClick === true) {
                if(game.field[x][y].has_mine === true) {
                    td.classList.remove("bomber");
                    for (let i = 0; i < 1;){
                        let x = parseInt(Math.random() * game.width);
                        let y = parseInt(Math.random() * game.height);
                        if(!(game.field[x][y].has_mine)) {
                            game.field[x][y].has_mine = true;
                            i++;
                            let td = this.table.rows[y].children[x];
                            td.classList.add("bomber");
                        }
                    }
                }
                game.field[x][y].has_mine = false;
                game.start_main_counter();
                firstClick = false;
            }
            this.open_near_click(x,y);

        },
        open_near_click: function (x, y) {
            let td = this.table.rows[y].children[x];
            if(game.field[x][y].not_clicked) {
                return;
            }
            if(td.classList.contains("flag")) {
                return;
            }
            if(game.field[x][y].has_mine){
                showModalLose();

                this.show_bombs();
                td.classList.add("dead");
                setTimeout(closeModalLose,1250);
                firstClick = true;
                setTimeout(restart,1300);
            }else{


                td.innerHTML = game.field[x][y].mineAlongside;
                    game.field[x][y].not_clicked = true;

                if(game.field[x][y].mineAlongside === 0 ) {
                    for (let i = x > 0 ? x - 1 : x; i <= x+1 && i < game.width; i++ ) {
                        for(let j = y > 0 ? y - 1 : y; j <= y + 1 && j < game.height ; j++) {
                                this.open_near_click(i, j);
                                td.innerHTML = ""

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
            x =  e.target.cellIndex;
            y = e.target.parentNode.rowIndex;
            if(game.field[x][y].not_clicked) return;

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
    let allInputs = document.querySelectorAll("input");
    let row = allInputs[1];
    let column = allInputs[2];
    let mine = allInputs[3];
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







