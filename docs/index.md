# MCJS Documentation
MCJS is both a compiler and a file format:
* `.mcjs` files are `.mcfunction` files wrapped with JavaScript.
* The compiler is used from the terminal to generate `.mcfunction` files from `.mcjs`.

## Installation
MCJS requires Node.js to function, which can be downloaded from [here](https://nodejs.org/en/download/current/). Once installed, open a terminal and run:
```
npm install -g @open-mapmaking/mcjs
```

## Command line interface
MCJS is accessible from the terminal.

### Compilation
Compile a single file from `.mcjs` to `.mcfunction`:
```
mcjs filename.mcjs
```
Will generate `filename.mcfunction`.

Pass a folder to compile each `.mcjs` files it contains to `.mcfunction`:
```
cd path/to/datapack
mcjs ./
```

### Watch
With the `watch` command, each `.mcjs` file save will trigger a recompilation:
```
mcjs watch filename.mcjs
```
It also works with a whole folder:
```
cd path/to/datapack
mcjs watch ./
```

## Reference
`.mcjs` files contain regular JavaScript and, when compiled, are executed just like `.js` files. They have access to the whole JavaScript syntax and to MCJS specific objects, which are specified here.

### The `cmd` function
At compilation, it is the `cmd` function that outputs commands in the resulting `.mcfunction` file. It takes a string as a parameter:
```javascript
cmd('say Hello world!')
cmd('summon creeper ~ ~ ~')
```
Will result to a `.mcfunction` file containing:
```
say Hello world!
summon creeper ~ ~ ~
```

`cmd` is also a template tag, which can write multiple commands at once. It also enable access to `${expression}` placeholders:
```javascript
let entity = 'creeper'
cmd`
summon ${entity} ~ ~ ~
execute as @e[type=${entity}] run say hello
`
```
Will result to:
```
summon creeper ~ ~ ~
execute as @e[type=creeper] run say hello
```