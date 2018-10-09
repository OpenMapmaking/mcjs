function stringBuffer() {
  let buffer = ''
  return (function(...args) {
    if(Array.isArray(args[0])) {
      let strings = args[0].raw
      let values = args.slice(1)

      buffer += strings.reduce((acc, string, i) => {
        let value = typeof values[i] !== 'undefined' ? values[i] : ''
        return acc + string + value
      }, '') + '\n'
    }
    else if(args.length === 1) {
      buffer += args[0] + '\n'
    }
    return buffer
  });
}

module.exports = stringBuffer
