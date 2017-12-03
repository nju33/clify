#!/usr/bin/env node
const fs = require('fs');
const {execFile} = require('child_process');
const path = require('path');
const {promisify} = require('util');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const ora = require('ora');
const yargs = require('yargs');
const isPromise = require('is-promise');

const pAccess = promisify(fs.access);
const pReadFile = promisify(fs.readFile);
const pWriteFile = promisify(fs.writeFile);
const pExecFile = promisify(execFile);
const pMkdirp = promisify(mkdirp);

const workdir = path.join(process.env.HOME, '.clify');
const pkgname = path.join(workdir, 'package.json');

async function getPkg() {
  let raw = null;

  try {
    await pAccess(workdir, fs.constants.F_OK);
    raw = await pReadFile(pkgname, 'utf-8');
  } catch (_) {
    await pMkdirp(workdir);

    const data = JSON.stringify({
      private: true,
      dependencies: {},
    });
    await pWriteFile(pkgname, data);

    raw = data;
  }

  const data = JSON.parse(raw);
  return data;
}

(async () => {
  const pkg = await getPkg();
  yargs
    .option('clean', {
      default: false,
      describe: `Delete ${workdir}`,
      type: 'boolean',
    })
    .option('simple', {
      alias: 's',
      default: false,
      describe: 'Display results only',
      type: 'boolean',
    })

  Object.keys(pkg.dependencies).forEach(name => {
    yargs.command(name, '');
  });

  const argv = yargs.help().argv;

  function blockquote(text) {
    return text
      .split('\n')
      .filter(chank => chank.trim())
      .map(chank => `> ${chank}`)
      .join('\n')
  }

  if (argv.clean) {
    const rimraf = require('rimraf');
    const pRimraf = promisify(rimraf);

    const spinner = ora({
      text: `${workdir} removing...`,
      color: 'yellow',
    })
    await pRimraf(workdir);
    spinner.succeed();
    process.exit(0);
  }

  const [packageName, ...args] = argv._;

  if (packageName === undefined) {
    console.log(chalk.red('Specify the package name at the first argument'));
    process.exit(1);
  }

  const nodeModulesDir = path.join(workdir, 'node_modules');
  const targetName = path.join(nodeModulesDir, packageName);

  try {
    let fn = require(targetName);
    if (fn.default !== undefined) {
      fn = fn.default;
    }

    try {
      const result = fn.apply(fn, args.map(arg => {
        try {
          arg = eval(`(${arg})`);
          return arg;
        } catch (_) {
          return arg;
        }
      }));
      
      if (!isPromise) {
        console.log(JSON.stringify(result, null, 2))
      } else {
        result.then(result => {
          console.log(JSON.stringify(result, null, 2))
        });
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

  } catch (_) {
    (async () => {
      const spinner = (() => {
        if (argv.simple) {
          return {succeed() {}, fail() {}};
        }
        return ora({
          text: `${packageName} installing...`,
          color: 'yellow',
        }).start();
      })();

      try {
        const {stdout} = await pExecFile(
          'npm',
          ['install', '--save', '--prefix', workdir, packageName],
        );
        spinner.succeed();
        if (!argv.simple) {
          console.log(chalk.gray(blockquote(stdout)));
        }
      } catch (err) {
          spinner.fail('ERR!');
          console.log(chalk.red(err.stderr));
          process.exit(1);
      }

      let fn = require(targetName);
      if (fn.default !== undefined) {
        fn = fn.default;
      }

      try {
        const result = fn.apply(fn, args.map(arg => {
          try {
            arg = eval(`(${arg})`);
            return arg;
          } catch (_) {
            return arg;
          }
        }));

        if (!isPromise) {
          console.log(JSON.stringify(result, null, 2))
        } else {
          result.then(result => {
            console.log(JSON.stringify(result, null, 2))
          });
        }
      } catch (err) {
        console.log(err);
        process.exit(1);
      }

    })();
  }
})();
