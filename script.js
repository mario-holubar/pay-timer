const form = document.querySelector('form')
const elemCurrentEarnings = document.getElementById('current-earnings')
const elemCalculationsDisplay = document.getElementById('calculations')
const wageInput = document.getElementById('input-hourly-wage')
const numberFormat = Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
var prevEarnings = 0.0

wageInput.value = localStorage.getItem('hourlyWage') || 0

const STATE = {
    hourlyWage: wageInput.value,
    clockedTime: 0,
    startTime: 0,
    pageTitle: document.title
}

document.title = `[0.00€] ${STATE.pageTitle}`

const updateLabels = (earnedTime) => {
    elemCalculationsDisplay.querySelector('.duration').textContent = `${Math.floor(earnedTime / 1000 / 60 / 60)} hours ${Math.floor(earnedTime / 1000 / 60 % 60)} minutes`
    const earnings = calculateEarnings(STATE.hourlyWage, earnedTime)
    if (earnings.toFixed(2) != prevEarnings.toFixed(2)) {
        scale = 110
    }
    prevEarnings = earnings
    const earningsString = numberFormat.format(earnings)
    elemCurrentEarnings.textContent = `${earningsString}€`
    document.title = `[${earningsString}€] ${STATE.pageTitle}`
}

wageInput.addEventListener('change', (event) => {
    event.preventDefault()
    STATE.hourlyWage = event.target.value
    localStorage.setItem('hourlyWage', event.target.value)
    if (!main.isRunning()) {
        updateLabels(STATE.clockedTime)
    }
})

const calculateEarnings = (rate, duration) => {
    return rate * duration / 1000 / 60 / 60
}

const update = (delta) => {
    // STATE.clockedTime += delta
}

var scale = 100.0
function resetAnim() {
    scale = 100.0
}

// TODO Make this framerate independent
function animate(t) {
    const x = Math.sin(t * 0.002) * 2
    const y = Math.sin(t * 0.003) * 1
    const angle = Math.sin(t * 0.0015) * 1
    scale -= (scale - 100) * 0.03
    elemCurrentEarnings.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale}%)`;
}

const draw = () => {
    const earnedTime = STATE.clockedTime + (Date.now() - STATE.startTime)
    animate(earnedTime)
    updateLabels(earnedTime)
}

const main = MainLoop.setUpdate(update).setDraw(draw);

form.querySelector('#input-toggle-clock').addEventListener('click', (event) => {
    if (main.isRunning()) {
        STATE.clockedTime += Date.now() - STATE.startTime
        main.stop()
        event.target.value = 'Start'
        resetAnim()
        animate(0)
        document.querySelector("link[rel~='icon']").href = "https://em-content.zobj.net/source/google/412/money-with-wings_1f4b8.png"
    } else {
        STATE.startTime = Date.now()
        main.start()
        event.target.value = 'Stop'
        document.querySelector("link[rel~='icon']").href = "https://em-content.zobj.net/source/animated-noto-color-emoji/356/money-with-wings_1f4b8.gif"
    }
})
