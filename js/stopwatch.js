let init = 0;
const AppStopwatch = (function () {
    let counter = 0;
    stopwatch = {
        container: document.getElementById('time-container')
    };
    let runClock;


    function displayTime() {
        stopwatch.container.innerHTML = moment().hour(0).minute(0).second(counter++).format('HH:mm:ss');
    }

    function startWatch() {
        runClock = setInterval(displayTime, 800);
    }

    function pauseTime() {
        clearInterval(runClock);
    }

    function stopWatch() {
        clearInterval(runClock);
        counter = 0;
        stopwatch.container.innerHTML = "00:00:00";
        init = 0;
    }

    return {
        startClock: startWatch,
        stopClock: stopWatch,
        pauseClock: pauseTime
    };
})();

function startWatch() {
    if (init === 0) {
        init = 1;
        AppStopwatch.startClock();
    }
}

function stopWatchs() {
    AppStopwatch.stopClock();
}

function pauseTime() {
    AppStopwatch.pauseClock();
}
