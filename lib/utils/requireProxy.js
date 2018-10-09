const path = require('path')

function requireProxy(proxypath) {
  return (targetpath) => {
    let requirepath = (targetpath[0] === '.') ?
      path.resolve(proxypath, targetpath) :
      targetpath
    return require(requirepath)
  }
}

module.exports = requireProxy