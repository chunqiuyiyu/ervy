const utils = require('./utils')
const {
  EOL,
  PAD,
  verifyData,
  curForward,
  curUp,
  curDown,
  curBack,
  getOriginLen
} = utils

const printBox = (width, height, style = '# ', left = 0, top = 0, type = 'coordinate') => {
  let result = curForward(left) + curUp(top)
  const hasSide = width > 1 || height > 1

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      result += style
    }

    if (hasSide) {
      if (i !== height - 1) {
        result += EOL + curForward(left)
      } else {
        result += EOL
      }
    }
  }

  if (type === 'data') {
    result += curDown(hasSide ? (top - height) : top) + curBack(left + getOriginLen(style))
  }
  return result
}

module.exports = (data, opts) => {
  verifyData(data)

  const newOpts = Object.assign({
    width: 10,
    left: 2,
    height: 10,
    style: '# ',
    sides: [1, 1],
    hAxis: ['+', '-', '>'],
    vAxis: ['|', 'A'],
    hName: 'X Axis',
    vName: 'Y Axis',
    zero: '+',
    ratio: [1, 1],
    hGap: 2,
    vGap: 2,
    legendGap: 0
  }, opts)

  const {
    left, height, style, sides, width, zero, hAxis, vAxis, ratio,
    hName, vName, hGap, vGap, legendGap
  } = newOpts

  let tmp; let result = ''
  const styles = data.map(item => item.style || style)
  const allSides = data.map(item => item.sides || sides)
  const keys = new Set(data.map(item => item.key))

  result += PAD.repeat(left) + vName
  result += PAD.repeat(legendGap)
  result += Array.from(keys)
    .map(
      key => key + ': ' + (data.find(
        item => item.key === key
      ).style || style)
    ).join(' | ') +
    EOL.repeat(2)

  result += printBox(width + left, height + 1, PAD.repeat(2))

  data.map((item, index) => {
    result += printBox(
      allSides[index][0],
      allSides[index][1],
      styles[index],
      item.value[0] * 2 + left + 1,
      item.value[1],
      'data'
    )
  })

  result += curBack(width * 2) + curUp(height + 1) +
          PAD.repeat(left + 1) + vAxis[1]

  for (let i = 0; i < height + 1; i++) {
    tmp = ((height - i) % vGap === 0 && i !== height)
      ? ((height - i) * ratio[1]).toString() : ''
    result += EOL + tmp.padStart(left + 1) + vAxis[0]
  }

  result += curBack() + zero + curDown(1) + curBack(1) + '0' + curUp(1)

  for (let i = 1; i < (width * 2) + hGap; i++) {
    if (!(i % (hGap * 2))) {
      result += hAxis[0]

      // Draw scale of horizontal axis
      const item = (i / 2) * ratio[0]
      const len = item.toString().length

      result += curDown(1) + curBack(1) + item + curUp(1)
      if (len > 1) {
        result += curBack(len - 1)
      }

      continue
    }

    result += hAxis[1]
  }

  result += hAxis[2] + PAD + hName + EOL

  return result
}
