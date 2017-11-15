let init = 0;
const AppStopwatch = (function () {
    let counter = 0;
    stopwatch = {
        container: document.getElementById('time-container')
    };
    let runClock;
    stopwatch.container.innerHTML = moment().hour(0).minute(0).second(counter++).format('HH : mm : ss');

    function displayTime() {
        stopwatch.container.innerHTML = moment().hour(0).minute(0).second(counter++).format('HH : mm : ss');
    }

    function startWatch() {
        runClock = setInterval(displayTime, 800);
    }

    function stopWatch() {
        clearInterval(runClock);
        counter = 0;
        stopwatch.container.innerHTML = moment().hour(0).minute(0).second(counter++).format('HH : mm : ss');
        init = 0;
    }

    return {
        startClock: startWatch,
        stopClock: stopWatch
    };
})();


function startWatch() {
    if (init === 0) {
        AppStopwatch.startClock();
        init = 1;
    }
}

function stopWatchs() {
    AppStopwatch.stopClock();
}
