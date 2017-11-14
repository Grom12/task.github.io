
function showModalWin() {
    let windowLose = document.querySelector(".modalCloseWins");
    windowLose.classList.remove("modalCloseWins");
    windowLose.classList.add("modalWindow");
}

function closeModalWin()  {
    let windowLose = document.querySelector(".modalWindow");
    windowLose.classList.remove("modalWindow");
    windowLose.classList.add("modalCloseWins");
}

function showModalLose() { //////
    let windowLose = document.querySelector(".modalCloseLoses");
    windowLose.classList.remove("modalCloseLoses");
    windowLose.classList.add("modalWindow");
}

function closeModalLose(){
    let windowLose = document.querySelector(".modalWindow");
    windowLose.classList.remove("modalWindow");
    windowLose.classList.add("modalCloseLoses");
}
