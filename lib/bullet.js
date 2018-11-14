const utils = require('./utils')
const { PAD, verifyData, maxKeyLen, EOL } = utils

module.exports = (data, opts) => {
  verifyData(data)

  const newOpts = Object.assign({
    barWidth: 1,
    style: '*',
    left: 1,
    width: 10,
    padding: 1
  }, opts)

  const {
    barWidth, left, width,
    padding, style
  } = newOpts

  let result = PAD.repeat(left)

  const values = data.map(item => item.value)
  const max = Math.max.apply(null, values)
  const maxKeyLength = maxKeyLen(data)

  let tmp, padChar, ratioLength, key, line
  const valLength = values.length
  for (let i = 0; i < valLength; i++) {
    tmp = data[i]
    ratioLength = Math.round(width * (tmp.value / max))
    padChar = tmp.style ? tmp.style : style
    key = tmp.key
    line = padChar.repeat(ratioLength) + EOL + PAD.repeat(left)
    result += key.padStart(maxKeyLength) + PAD

    for (let j = 0; j < (tmp.barWidth || barWidth); j++) {
      if (j > 0) {
        result += PAD.repeat(maxKeyLength + 1) + line
      } else {
        result += line
      }
    }

    if (i !== valLength - 1) {
      result += EOL.repeat(padding) + PAD.repeat(left)
    }
  }

  return result
}
