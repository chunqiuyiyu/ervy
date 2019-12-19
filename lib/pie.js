const utils = require('./utils')
const { verifyData, PAD, maxKeyLen, EOL } = utils
let tmp

const getPadChar = (styles, values, param, gapChar) => {
  const firstVal = values[0]
  if (!values.length) return gapChar
  return param <= firstVal ? styles[0]
    : getPadChar(styles.slice(1), values.slice(1), param - firstVal, gapChar)
}

module.exports = (data, opts, isDonut = false) => {
  verifyData(data)

  const newOpts = Object.assign({
    radius: 4,
    left: 0,
    innerRadius: 1
  }, opts)

  const { radius, left, innerRadius } = newOpts

  let result = PAD.repeat(left)

  const values = data.map(item => item.value)
  const total = values.reduce((a, b) => a + b)
  const ratios = values.map(value => (value / total).toFixed(2))
  const styles = data.map(item => item.style)
  const keys = data.map(item => item.key)
  const maxKeyLength = maxKeyLen(data)
  const limit = isDonut ? innerRadius : 0
  const gapChar = styles.slice(-1)[0]

  for (let i = -radius; i < radius; i++) {
    for (let j = -radius; j < radius; j++) {
      if (Math.pow(i, 2) + Math.pow(j, 2) < Math.pow(radius, 2)) {
        tmp = Math.atan2(i, j) * 1 / Math.PI * 0.5 + 0.5
        result += isDonut ? (Math.abs(i) > limit || Math.abs(j) > limit)
          ? getPadChar(styles, ratios, tmp, gapChar)
          : PAD.repeat(2)
          : getPadChar(styles, ratios, tmp, gapChar)
      } else {
        result += PAD.repeat(2)
      }
    }

    result += EOL + PAD.repeat(left)
  }

  result += EOL + PAD.repeat(left)

  for (var i = 0; i < styles.length; i++) {
    result += styles[i] + PAD + keys[i].padStart(maxKeyLength) + ': ' +
           values[i] + PAD + '(' + (ratios[i] * 100).toFixed(0) + '%' + ')' +
           EOL + PAD.repeat(left)
  }

  return result
}
