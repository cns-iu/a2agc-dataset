/*jshint esversion: 6 */
var fs = require('fs');
var process = require('child_process');

var packageJson = null;
try {
  packageJson = fs.readFileSync('package.json', 'utf8');
} catch(err) {
  console.log('Error while reading package.json', err);
}

var version = JSON.parse(packageJson).version;
process.exec('git log -1 --pretty="%ct" --date=local', {cwd: __dirname}, function(err, stdout, stderr) {
  var buildInfo = {
    version,
    lastCommitDate: new Date(Number(stdout.trim())*1000).getTime(),
    buildDate: new Date().getTime()
  };
  var output = `export const buildInfo = {
  version: '${buildInfo.version}',
  lastCommitDate: new Date(${buildInfo.lastCommitDate}),
  buildDate: new Date(${buildInfo.buildDate})
};
`;
  fs.writeFileSync('apps/a2agc/src/app/build-info.ts', output);
});
