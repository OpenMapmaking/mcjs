const fs = require('fs')
const util = require('util')

const fsAsyncFunctions = [
  'access', 'rename', 'ftruncate', 'chown', 'lchown', 'fchmod', 'stat', 'lstat',
  'fstat', 'link', 'symlink',	'readlink', 'realpath', 'unlink', 'rmdir',
  'readdir', 'close', 'open', 'utimes',	'futimes', 'fsync', 'write', 'read',
  'readFile', 'writeFile', 'appendFile', 'mkdir'
]

const aw = fsAsyncFunctions.reduce(
  (accumulator, fnName) => {
    accumulator[fnName] = util.promisify(fs[fnName])
    return accumulator
  }, {}
)

module.exports = aw