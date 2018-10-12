const fs = require('fs')
const aw = require('./utils/await-fs')
const path = require('path')
const vm = require('vm')
const EventEmitter = require('events')
const requireProxy = require('./utils/requireProxy')
const stringBuffer = require('./utils/stringBuffer')
const fileBuffer = require('./utils/fileBuffer')
const createMonitor = require('watch').createMonitor
const MC = require('./mc')

const MCJS = {}
MCJS.events = new EventEmitter()

MCJS.read = function(mcjsInput, sandbox = {}, filepath = null) {
  sandbox.cmd = stringBuffer()
  sandbox.console = console
  sandbox.raw = String.raw
  Object.assign(sandbox, MC)
  vm.runInNewContext(mcjsInput, sandbox, filepath)
  let mcfOutput = sandbox.cmd.clean()
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
  let sandbox = {}
  sandbox.require = requireProxy(path.dirname(inputpath))
  sandbox.mcfunction = fileBuffer('cmd')

  let filePromises = []

  let mcfOutput = MCJS.read(fileMCJS, sandbox, inputpath)
  filePromises.push(aw.writeFile(outputpath, mcfOutput))

  let outputdir = path.dirname(outputpath)
  let mcfunctions = sandbox.mcfunction()
  for(let mcfName in mcfunctions) {
    let mcfPath = path.resolve(outputdir, mcfName + '.mcfunction')
    let mcfContent = mcfunctions[mcfName].content.clean()
    filePromises.push(aw.writeFile(mcfPath, mcfContent))
  }

  await Promise.all(filePromises)
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
