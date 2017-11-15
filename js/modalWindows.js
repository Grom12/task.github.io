function showModal(modal, closeModal, modalShow) {
    let windowLose = document.querySelector(`${modal}`);
    windowLose.classList.remove(`${modalShow}`);
    windowLose.classList.add(`${closeModal}`);
}

function closeModal(modal, closeModal, modalHide) {
    let windowLose = document.querySelector(`${modal}`);
    windowLose.classList.remove(`${modalHide}`);
    windowLose.classList.add(`${closeModal}`);
}
