const utils = require('./utils')
const { PAD, padMid, verifyData, EOL } = utils

module.exports = (data, opts) => {
  verifyData(data)

  const newOpts = Object.assign({
    barWidth: 3,
    left: 1,
    height: 6,
    padding: 3,
    style: '*'
  }, opts)

  const {
    barWidth, left, height,
    padding, style
  } = newOpts
  let result = PAD.repeat(left)

  const values = data.map(item => item.value)
  const max = Math.max.apply(null, values)
  const length = data.length

  let tmp, padChar, ratio, valStr
  for (let i = 0; i < height + 2; i++) {
    for (let j = 0; j < length; j++) {
      tmp = data[j]
      valStr = tmp.value.toString()
      ratio = height - (height * tmp.value / max)
      // ratio = height * tmp.value / max

      padChar = ratio > (i + 2) ? PAD
        : Math.round(ratio) === i
          ? valStr
          : Math.round(ratio) < i
            ? (tmp.style || style) : PAD

      if (padChar === valStr) {
        result += padMid(valStr, barWidth) + PAD.repeat(padding)
        continue
      }

      if (i !== height + 1) {
        // if (i - Math.round(ratio) >= 2 && barWidth > 2 && padChar === style) {
        // result += padChar + PAD.repeat(barWidth - 2) + padChar
        // } else {
        result += padChar.repeat(barWidth)
        // }

        result += PAD.repeat(padding)
      } else {
        result += tmp.key.length > barWidth
          ? tmp.key.padEnd(barWidth + padding)
          : padMid(tmp.key, barWidth) + PAD.repeat(padding)
      }
    }

    if (i !== height + 1) {
      result += EOL + PAD.repeat(left)
    }
  }

  return result
}
