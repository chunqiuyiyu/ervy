const utils = require('./utils')
const {
  EOL,
  PAD,
  verifyData,
  curForward,
  curUp,
  curDown,
  curBack
} = utils

const printBox = (width, height, style = '# ', left = 0, top = 0) => {
  let result = curForward(left) + curUp(top)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      result += style
    }

    if (i !== height - 1) {
      result += EOL + curForward(left)
    } else {
      result += EOL
    }
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
    side: 1,
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
    left, height, style, side, width, zero, hAxis, vAxis, ratio,
    hName, vName, hSlugs, hGap, vGap, legendGap
  } = newOpts

  let tmp; let result = ''
  const styles = data.map(item => item.style || style)
  const sides = data.map(item => item.side || side)
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
      sides[index],
      sides[index],
      styles[index],
      item.value[0] * 2 + left + 1,
      item.value[1]
    ) + curDown(item.value[1])
  })

  result += curBack(width * 2) + curUp(height + 1) +
          PAD.repeat(left + 1) + vAxis[1]

  for (let i = 0; i < height + 1; i++) {
    tmp = ((height - i) % vGap === 0 && i !== height)
      ? ((height - i) * ratio[1]).toString() : ''
    result += EOL + tmp.padStart(left + 1) + vAxis[0]
  }

  result += curBack() + zero

  for (let i = 0; i < (width * 2) + 2; i++) {
    if ((i + 1) % (hGap * 2) === 0) {
      tmp = hSlugs ? hSlugs[(i + 1) / (hGap * 2) - 1].length || 1
        : (((i + 1) / 2) * ratio[0]).toString().length

      result += hAxis[0]
      result += hAxis[1].repeat(tmp - 1)

      continue
    }

    result += hAxis[1]
  }

  result += hAxis[2] + PAD + hName + EOL + PAD.repeat(left + 1)

  for (let i = 0; i < (width * 2) + hGap; i++) {
    if (i % (hGap * 2) === 0) {
      result += hSlugs ? hSlugs[i / (hGap * 2)] || PAD
        : (i / 2) * ratio[0]
      continue
    }

    result += PAD
  }

  return result
}
