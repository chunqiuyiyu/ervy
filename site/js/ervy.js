(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ervy = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { bg, fg } = require('./lib/utils')

module.exports = {
  bar: require('./lib/bar'),
  bullet: require('./lib/bullet'),
  donut: require('./lib/donut'),
  gauge: require('./lib/gauge'),
  scatter: require('./lib/scatter'),
  pie: require('./lib/pie'),
  bg,
  fg
}

},{"./lib/bar":2,"./lib/bullet":3,"./lib/donut":4,"./lib/gauge":5,"./lib/pie":6,"./lib/scatter":7,"./lib/utils":8}],2:[function(require,module,exports){
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

},{"./utils":8}],3:[function(require,module,exports){
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

},{"./utils":8}],4:[function(require,module,exports){
const pie = require('./pie')

module.exports = (data, opts) => {
  return pie(data, opts, true)
}

},{"./pie":6}],5:[function(require,module,exports){
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

},{"./utils":8}],6:[function(require,module,exports){
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

},{"./utils":8}],7:[function(require,module,exports){
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

},{"./utils":8}],8:[function(require,module,exports){
const os = require('os')
const PAD = ' '
const EOL = os.EOL

const bgColors = {
  'black': '40',
  'red': '41',
  'green': '42',
  'yellow': '43',
  'blue': '44',
  'magenta': '45',
  'cyan': '46',
  'white': '47'
}

module.exports = {
  PAD,
  EOL,

  bg: (color = 'cyan', length = 1) => {
    const currentBg = bgColors[color]
    if (typeof color !== 'string' || !currentBg) {
      throw new TypeError(`Invalid backgroundColor: ${JSON.stringify(color)}`)
    }

    return '\x1b[' + currentBg + 'm' + PAD.repeat(length) + '\x1b[0m'
  },

  fg: (color = 'cyan', str) => {
    const currentBg = bgColors[color]
    if (typeof color !== 'string' || !currentBg) {
      throw new TypeError(`Invalid foregroundColor: ${JSON.stringify(color)}`)
    }

    return '\x1b[' + parseInt(bgColors[color] - 10) + 'm' + str + '\x1b[0m'
  },

  padMid: (str, width) => {
    const mid = Math.round((width - str.length) / 2)
    const length = str.length

    return length > width ? str.padEnd(width)
      : PAD.repeat(mid) + str +
      PAD.repeat(mid + ((mid * 2 + length) > width ? -1 : 0))
  },

  verifyData: (data) => {
    const length = data.length

    if (!Array.isArray(data) ||
      length === 0 ||
      !data.every(item => item.key && !Number.isNaN(item.value))
    ) {
      throw new TypeError(`Invalid data: ${JSON.stringify(data)}`)
    }
  },

  maxKeyLen: (data) => Math.max.apply(null, data.map(item => item.key.length)),
  // eslint-disable-next-line
  getOriginLen: (str) => str.replace(/\x1b\[[0-9;]*m/g, '').length,

  curForward: (step = 1) => `\x1b[${step}C`,
  curUp: (step = 1) => `\x1b[${step}A`,
  curDown: (step = 1) => `\x1b[${step}B`,
  curBack: (step = 1) => `\x1b[${step}D`
}

},{"os":9}],9:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}]},{},[1])(1)
});
