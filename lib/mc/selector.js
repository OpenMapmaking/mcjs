class Selector {
  constructor(target = 'e', args = {}) {
    this.target = target
    this.args = Selector.parseArgs(args)
  }

  static a(...args) { return new Selector('a', ...args) }
  static e(...args) { return new Selector('e', ...args) }
  static p(...args) { return new Selector('p', ...args) }
  static s(...args) { return new Selector('s', ...args) }

  static parseArgs(args) {
    if(typeof args === 'object') {
      return args
    }

    if(typeof args === 'string') {
      return args.split(',')
        .reduce(function(acc, arg, i) {
          let splittedArg = arg.split('=')
          acc[splittedArg[0]] = splittedArg[1]
          return acc
        }, {})
    }

    return {}
  }

  serializeArgs() {
    let serializedArgs = Object.entries(this.args)
      .map(entry => entry.join('='))
      .join(',')
    return serializedArgs
  }

  add(args) {
    let newArgs = Object.assign({}, this.args, Selector.parseArgs(args))
    return new Selector(this.target, newArgs)
  }

  ignore(argName) {
    let newArgs = Object.assign({}, this.args)
    if(typeof newArgs[argName] !== undefined) delete newArgs[argName]
    return new Selector(this.target, newArgs)
  }

  toString() {
    return '@' + this.target + '[' + this.serializeArgs() + ']'
  }
}

module.exports = Selector