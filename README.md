FMA cli tool
============

FMA (famicom macro assembler) is a powerful assembler mainly developed for creating
SNES applications.

Please see the `fma` package for further details

Installation
------------

To install FMA you need to have NPM installed. Then simply call:

```bash
npm install -g fma-cli
```

Usage
-----

To get a list of all command line arguments, call `fma --help` from command line.

```bash
fma -o output.sfc file1.fma file2.fma
```

| Parameter | Description |
| --------- | ----------- |
| -I <path> | Adds an include path |
| -o <file> | Defines the output file (Default a.sfc) |
| -s <file> | Writes a symbol file |


License
-------

FMA is licensed with the [MIT](./LICENSE.md) license. Author: Benjamin Schulte
