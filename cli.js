#! /usr/bin/env node
const MCJS = require('./lib/MCJS')
const program = require('commander')
const version = require('./package.json').version

program.version(version)

program
  .arguments('<input>')
  .action(input => compile(input))

program
  .command('compile <input>')
  .description('compile a file or an entire folder')
  .action(input => compile(input))

program
  .command('watch <input>')
  .description('watch a file or an entire folder')
  .action(input => watch(input))

MCJS.events.on('compileFile', (inputpath, outputpath) => {
  console.log('compiled ' + inputpath + ' => ' + outputpath)
})

async function compile(input) {
  try {
    await MCJS.compile(input)
  }
  catch(error) {
    console.log(error)
  }
}

async function watch(input) {
  try {
    await MCJS.watch(input)
  }
  catch(error) {
    console.log(error)
  }
}

program.parse(process.argv)