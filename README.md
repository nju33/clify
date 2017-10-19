# clify

[![npm version](https://badge.fury.io/js/%40nju33%2Fclify.svg)](https://badge.fury.io/js/%40nju33%2Fclify)

Run the package function in cli

## install

```bash
npm i -g @nju33/clify
```

## Usage

```bash
clify <package-name> <...args>
```

## Example

```bash
clify lodash.pad foo 8 # === lodashPad('foo', 8)

# Only for the first tim#e
#   ✔ lodash.pad installing...
#   > + lodash.pad@4.5.1
#   > added 1 package in 1.364s
#
#   "  foo   "

clify lodash.pad bar 8
# "  bar   "
```

## Help

```bash
clify --Help
# Commands:
#   lodash.pad
#
# Options:
#   --help        Show help                                              [boolean]
#   --version     Show version number                                    [boolean]
#   --clean       Delete /Users/nju33/.clify            [boolean] [default: false]
#   --simple, -s  Display results only                  [boolean] [default: false]

```
