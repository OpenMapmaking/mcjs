function stringBuffer() {
  let buffer = ''
  let strBuffer = (...args) => {
    if(Array.isArray(args[0])) {
      buffer += String.raw(...args) + '\n'
    }
    else if(args.length === 1) {
      buffer += args[0] + '\n'
    }
    return buffer
  }

  strBuffer.clean = () => buffer
    .replace(/\s*[\n\r]+\s*/g, '\n')
    .replace(/^[\n\r]+/, '')
    .replace(/[\n\r]+$/, '')

  return strBuffer
}

module.exports = stringBuffer
