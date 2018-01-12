# clify

[![npm version](https://badge.fury.io/js/%40nju33%2Fclify.svg)](https://badge.fury.io/js/%40nju33%2Fclify)

Before installng module, whose function use in cli

## Usage

```bash
npx @nju33/clify <module-name> <...args>
```

## Example

```bash
# Firstly, runnning to install process for you tried to use module (this's only once)
$ npx @nju33/clify nanoid
# ✔ nanoid installing...
# > + nanoid@1.0.1
# > added 1 package in 0.536s
"Y1VEj21ViLoHA_vy0_QJp"

# After the second time, it's simply denotes the result of function
$ npx @nju33/clify nanoid
"6KxKev1oGll96Qgky3vGb"

# async-await is fine as well.
# Arguments can be passed after the module name.
$ npx @nju33/clify pkg-dir '__dirname'
"path/to/node/project"

# You can remove to installing module so far. in following command.
$ npx @nju33/clify --clean
```
