const utils = require('./utils')
const { padMid, verifyData, PAD, EOL } = utils

module.exports = (data, opts) => {
  verifyData(data)

  const newOpts = Object.assign({
    radius: 5,
    left: 2,
    style: '# ',
    bgStyle: '+ '
  }, opts)

  const { radius, left, style, bgStyle } = newOpts

  let tmp; let result = PAD.repeat(left)

  for (let i = -radius; i < 0; i++) {
    for (let j = -radius; j < radius; j++) {
      if (Math.pow(i, 2) + Math.pow(j, 2) < Math.pow(radius, 2)) {
        if (Math.abs(i) > 2 || Math.abs(j) > 2) {
          tmp = Math.atan2(i, j) * 1 / Math.PI + 1
          result += tmp <= data[0].value ? (data[0].style || style) : bgStyle
        } else {
          if (j === 0 & i === -1) {
            result += Math.round(data[0].value * 100)
            continue
          }

          result += PAD.repeat(2)
        }
      } else {
        result += PAD.repeat(2)
      }
    }

    result += EOL + PAD.repeat(left)
  }

  result += PAD.repeat(radius - 2) + '0' + PAD.repeat(radius - 4) +
    padMid(data[0].key, 11) +
    PAD.repeat(radius - 4) +
    '100'

  return result
}
