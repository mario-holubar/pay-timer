const form = document.querySelector('form')
const elemCurrentEarnings = document.getElementById('current-earnings')
const elemCalculationsDisplay = document.getElementById('calculations')
const wageInput = document.getElementById('input-hourly-wage')
const numberFormat = Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

const draw = () => {
  const earnedTime = STATE.clockedTime + (Date.now() - STATE.startTime)
  updateLabels(earnedTime)
}

const main = MainLoop.setUpdate(update).setDraw(draw);

form.querySelector('#input-toggle-clock').addEventListener('click', (event) => {
  if (main.isRunning()) {
    STATE.clockedTime += Date.now() - STATE.startTime
    main.stop()
    event.target.value = 'Start'
  } else {
    STATE.startTime = Date.now()
    main.start()
    event.target.value = 'Stop'
  }
})