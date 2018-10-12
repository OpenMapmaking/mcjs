function stringBuffer() {
  let buffer = ''
  return (...args) => {
    if(Array.isArray(args[0])) {
      buffer += String.raw(...args) + '\n'
    }
    else if(args.length === 1) {
      buffer += args[0] + '\n'
    }
    return buffer
  }
}

module.exports = stringBuffer
