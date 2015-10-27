/* eslint no-cond-assign: 0 */
import childProcess from 'child_process';

const spawn = childProcess.spawn;
const npmlsg = spawn('npm', ['list', '-g', '--depth=0']);

function install(modules) {
  const npm = spawn('npm', ['install', '-g'].concat(modules));
  npm.stdout.on('data', (data) => console.info(data.toString()));
  npm.stderr.on('data', (data) => console.error(data.toString()));
  npm.on('close', () => console.log('\ndone.'));
}

npmlsg.stdout.on('data', (data) => {
  const regExp = /── (.*?)@/g;
  const str = data.toString();
  const modules = [];
  let results;
  while ((results = regExp.exec(str)) !== null) {
    const module = results[1];
    if (module !== 'npm') {
      modules.push(module);
    }
  }
  console.info(`Modules to install: ${ modules.join(' ') }`);
  install(modules);
});

npmlsg.stderr.on('data', (data) => console.log(data.toString()));
