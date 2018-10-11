# MCJS

Minecraft commands generated with JavaScript.

## Features

* Compiles `.mcjs` files to `.mcfunction`.
* Generate Minecraft commands using all the power of JavaScript.

In terminal, use the `--help` option to see all the commands available:

```
mcjs --help
```

## Getting started

1. Install Node.js, open a terminal and type:

```
npm install %name%
```

2. Create a `test.mcjs` file containing:

```javascript
let entities = ['creeper', 'zombie', 'bat']

for (let entity of entities) {
  cmd`
  summon ${entity} ~ ~ ~
  say Summoned ${entity}!
  `
}
```

3. Compile `test.mcjs` from terminal:

```
mcjs test.mcjs
```

It will create `test.mcfunction` in the same folder with the following content:

```
summon creeper ~ ~ ~
say Summoned creeper!
summon zombie ~ ~ ~
say Summoned zombie!
summon bat ~ ~ ~
say Summoned bat!
```

### The `cmd` function

When the `cmd` function is called from a `.mcjs` file, it outputs the string it gets to the final `.mcfunction` file:

* `test.mcjs`

```javascript
cmd('say hello')
cmd('summon creeper ~ ~ ~')
```

* `test.mcfunction`

```
say hello
summon creeper ~ ~ ~
```

`cmd` is also a *template tag*, which means that multiline strings are available:

* `test.mcjs`

```javascript
let name = 'Steve'

cmd`
say ${name}!
say ${name.toUpperCase()}!!
`
```

* `test.mcfunction`

```
say Steve!
say STEVE!!
```
