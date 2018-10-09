const fs = require('fs')
const aw = require('./utils/await-fs')
const path = require('path')
const vm = require('vm')
const EventEmitter = require('events')
const requireProxy = require('./utils/requireProxy')
const stringBuffer = require('./utils/stringBuffer')
const createMonitor = require('watch').createMonitor

const MCJS = {}
MCJS.events = new EventEmitter()

MCJS.read = function(mcjsInput, sandbox = {}, filepath = null) {
  sandbox.cmd = stringBuffer()
  vm.runInNewContext(mcjsInput, sandbox, filepath)
  let mcfOutput = sandbox.cmd()
    .replace(/\s*[\n\r]+\s*/g, '\n')
    .replace(/^[\n\r]+/, '')
    .replace(/[\n\r]+$/, '')
  return mcfOutput
}

MCJS.compileFolder = async function(inputpath) {
  let dirEnts = await aw.readdir(inputpath, {withFileTypes: true})
  dirEnts
    .filter(dirEnt =>
      dirEnt.isDirectory() || dirEnt.isFile() && dirEnt.name.match(/\.mcjs$/)
    )
    .forEach(dirEnt => {
      aw.realpath(inputpath + '/' + dirEnt.name)
        .then(entPath => MCJS.compile(entPath))
    })
}

MCJS.compileFile = async function(inputpath, outputpath) {
  if(outputpath == null) {
    outputpath = inputpath.replace(/\.mcjs$/, '.mcfunction')
  }
  let fileMCJS = await aw.readFile(inputpath, 'utf8')
  let sandbox = {require: requireProxy(path.dirname(inputpath))}

  let mcfOutput = MCJS.read(fileMCJS, sandbox, inputpath)
  await aw.writeFile(outputpath, mcfOutput)
  MCJS.events.emit('compileFile', inputpath, outputpath)
}

MCJS.compile = async function(input) {
  let realpath = await aw.realpath(input)
  let inputstats = await aw.lstat(input)

  if(inputstats.isDirectory()) {
    await MCJS.compileFolder(realpath)
  }
  else if(inputstats.isFile()) {
    await MCJS.compileFile(realpath)
  }
}

MCJS.watchFolder = function(folderpath) {
  let changedCallback = f => {
    if(f.match(/\.mcjs$/)) {
      MCJS.compile(f)
    }
  }
  createMonitor(folderpath, monitor => {
    monitor.on("created", changedCallback)
    monitor.on("changed", changedCallback)
  })
}

MCJS.watchFile = function(filepath) {
  fs.watchFile(filepath, (eventType, filename) => {
    MCJS.compile(filepath)
  })
}

MCJS.watch = async function(input) {
  let realpath = await aw.realpath(input)
  let inputstats = await aw.lstat(input)

  if(inputstats.isDirectory()) {
    MCJS.watchFolder(realpath)
  }
  else if(inputstats.isFile()) {
    MCJS.watchFile(realpath)
  }
}

module.exports = MCJS