#!/usr/bin/env node

function collect(val, memo) {
  memo.push(val);
  return memo;
}

var config = require('./package.json');
var program = require('commander');
program
  .version(config.version)
  .arguments('<file ...>')
  .option('-I <dir>', 'Adds an include directory', collect, [])
  .option('-D <dir>', 'Generates the documentation to a folder')
  .option('--doc-package <name>', 'Includes a package when documentating the result', collect, [])
  .option('-s <file>', 'Output symbol files')
  .option('-o <file>', 'Specifies the output filename')
  .parse(process.argv)

if (!program.args.length) {
  throw new Error('Missing input files. Please provide at least one input file.')
}

var fs = require('fs');
var fma = require('fma');
var fma65816 = require('fma-snes65816');

var project = new fma.Project();
project.registerPlugin(new fma65816.Plugin());

for (let includeDir of program.I) {
  project.addIncludeDir(includeDir);
}

var interpreter = new fma.Interpreter(project);
var parser = new fma.Parser(project);
for (let file of program.args) {
  project.log('info', 'Compiling file ' + file);
  interpreter.process(parser.parseFile(file));
}

project.log('info', 'Linking application');
var linker = new fma.Linker(project);
interpreter.buildObject((err, object) => {
  if (err) {
    throw err;
  }

  linker.addObject(object);

  var result = linker.link();
  project.log('info', 'Writing binary');
  fs.writeFileSync(program.O || 'a.sfc', result.getBinary());

  if (program.S) {
    project.log('info', 'Writing symbol file');
    var writer = new fma65816.SymbolListWriter(result.getSymbols(), result.getCommands());
    fs.writeFileSync(program.S, writer.write());
  }

  if (program.D) {
    var adoc = require('fma-adoc');
    var generator = new adoc.DocumentationGenerator({
      outputDir: program.D,
      packages: program.docPackage
    })

    project.log('info', 'Generating documentation');
    generator.add(interpreter.getRoot())
    generator.generate();
  }

  project.log('info', 'Done.');
})
