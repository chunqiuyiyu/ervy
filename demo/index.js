const bar = require('../lib/bar')
const pie = require('../lib/pie')
const bullet = require('../lib/bullet')
const donut = require('../lib/donut')
const gauge = require('../lib/gauge')
const scatter = require('../lib/scatter')
const { bg, fg } = require('../lib/utils')

// Bar
const barData = [
  { key: 'A', value: 5, style: '*' },
  { key: 'B', value: 3, style: '+' },
  { key: 'C', value: 11 },
  { key: 'D', value: 1, style: bg('red') },
  { key: 'E', value: 5, style: bg('green') },
  { key: 'F', value: 7, style: bg('blue'), padding: 1 }
]

console.log(bar(barData))

// Pie
const pieData1 = [
  { key: 'A', value: 5, style: '* ' },
  { key: 'B', value: 10, style: '+ ' },
  { key: 'C', value: 10, style: '# ' },
  { key: 'D', value: 10, style: 'O ' }
]

const pieData2 = [
  { key: 'A', value: 5, style: bg('cyan', 2) },
  { key: 'B', value: 5, style: bg('yellow', 2) },
  { key: 'C', value: 5, style: bg('magenta', 2) },
  { key: 'D', value: 5, style: bg('white', 2) }
]

console.log(pie(pieData1, { left: 1 }))
console.log(pie(pieData2, { left: 1 }))

// Bullet
const bulletData = [
  { key: 'Month', value: 5 },
  { key: 'Week', value: 3, style: fg('red', '*') },
  { key: 'Day', value: 20, style: bg('blue'), barWidth: 1 },
  { key: 'Now', value: 15, style: bg('cyan'), barWidth: 1 }
]

console.log(bullet(bulletData, { style: '+', width: 30, barWidth: 2 }))

// Donut
const donutData1 = [
  { key: 'A', value: 10, style: fg('cyan', '+ ') },
  { key: 'B', value: 10, style: fg('red', '* ') }
]

const donutData2 = [
  { key: 'A', value: 20, style: bg('green', 2) },
  { key: 'B', value: 20, style: bg('blue', 2) },
  { key: 'C', value: 20, style: bg('yellow', 2) }
]

console.log(donut(donutData1, { left: 1 }))
console.log(donut(donutData2, { left: 1, gapChar: bg('yellow', 2) }))

// Gauge
const gaugeData1 = [
  { key: 'A', value: 0.5 }
]

const gaugeData2 = [
  { key: 'PR', value: 0.3 }
]

console.log(gauge(gaugeData1, { radius: 7 }))
console.log(gauge(gaugeData2, {
  radius: 7, style: bg('green', 2), bgStyle: bg('magenta', 2)
}))

// Scatter
const scatterData = []

for (let i = 1; i < 17; i++) {
  i < 6 ? scatterData.push({ key: 'A', value: [i, i], style: fg('red', '*') })
    : scatterData.push({ key: 'A', value: [i, 6], style: fg('red', '*') })
}

scatterData.push({ key: 'B', value: [2, 6], style: fg('blue', '# '), side: 2 })
scatterData.push({ key: 'C', value: [6, 9], style: bg('cyan', 2) })

console.log(scatter(scatterData, { legendGap: 18, width: 15 }))
