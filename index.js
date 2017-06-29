const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// All recognized flags.
const flags = ['-n', '--name', '-a', '--author'];

// Properties to be set by flags.
var pluginName;
var pluginAuthor;

// TODO: implement.
var structured;

// Check if all flags are valid.
try {
    checkFlags();
} catch (error) {
    console.log(error.message);
    return;
}

// TODO: implement customisable output directory.
let outDir = path.join(process.cwd(), pluginName);

// Make sure output directory exists.
try {
    fs.statSync(outDir);
} catch (error) {
    console.log("[KGen] Creating directory: " + outDir);
    fs.mkdirSync(outDir);
}

// Make sure the output directory is empty.
try {
    let filesInOutDir = fs.readdirSync(outDir);
    if (filesInOutDir.length != 0) {
        throw new Error('[KGen] Output directory already exists. Aborting...');
    }
} catch (error) {
    console.log(chalk.red(error.message));
    return;
}

// Copy Lib K Relay.
fs.createReadStream('src/lib/Lib K Relay.dll').pipe(fs.createWriteStream(path.join(outDir, 'Lib K Relay.dll')));

// Generate directories.
fs.mkdirSync(path.join(outDir, 'Properties'));

// Generate Assembly info.
let guid = b();
let assemblyInfo = fs.readFileSync('src/template/nst-AssemblyInfo.cs', { encoding: 'utf8', flag: 'r' });
assemblyInfo = assemblyInfo.replace(/%NAME%/g, pluginName);
assemblyInfo = assemblyInfo.replace(/%GUID%/g, guid);
fs.writeFileSync(path.join(outDir, 'Properties', 'AssemblyInfo.cs'), assemblyInfo, { encoding: 'utf8', flag: 'w' });

// Generate Project file.
let projectFile = fs.readFileSync('src/template/nst-Project.csproj', { encoding: 'utf8', flag: 'r' });
projectFile = projectFile.replace(/%NAME%/g, pluginName);
projectFile = projectFile.replace(/%GUID%/g, guid.toUpperCase());
fs.writeFileSync(path.join(outDir, pluginName + '.csproj'), projectFile, { encoding: 'utf8', flag: 'w' });

// Generate Plugin.cs
let pluginFile = fs.readFileSync('src/template/t-Plugin.cs', { encoding: 'utf8', flag: 'r' });
pluginFile = pluginFile.replace(/%NAME%/g, pluginName);
pluginFile = pluginFile.replace(/%AUTHOR%/g, pluginAuthor);
fs.writeFileSync(path.join(outDir, 'Plugin.cs'), pluginFile, { encoding: 'utf8', flag: 'w' });

console.log(chalk.green('[KGen] Done!'));
console.log(chalk.green('----------------'));
console.log('Project Name: ' + pluginName);
console.log('Project Author: ' + pluginAuthor);

function checkFlags() {
    let args = process.argv;
    /* region: Name */
    if (args.indexOf('-n') == -1 && args.indexOf('--name') == -1) {
        throw new Error(chalk.red('[KGen] No name specified.'));
    }
    let nameIndex = (args.indexOf('-n') == -1 ? args.indexOf('--name') : args.indexOf('-n')) + 1;
    if (args.length < nameIndex + 1 || flags.indexOf(args[nameIndex]) != -1) {
        throw new Error(chalk.red('[KGen] Flag \'' + args[nameIndex - 1] + '\' must be followed by a string'));
    }
    pluginName = args[nameIndex];
    /* endregion */

    /* region: Author */
    if (args.indexOf('-a') == -1 && args.indexOf('--author') == -1) {
        throw new Error(chalk.red('[KGen] No author specified.'));
    }
    let authorIndex = (args.indexOf('-a') == -1 ? args.indexOf('--author') : args.indexOf('-a')) + 1;
    if (args.length < authorIndex + 1 || flags.indexOf(args[authorIndex]) != -1) {
        throw new Error(chalk.red('[KGen] Flag \'' + args[authorIndex - 1] + '\' must be followed by a string'));
    }
    pluginAuthor = args[authorIndex];
    /* endregion */

    /* region: Structured */
    if (args.indexOf('-s') == -1 && args.indexOf('--structured') == -1) {
        structured = false;
    } else {
        structured = true;
    }
    /* endregion */
}

// Generate a random v4 GUID. Thanks to: https://gist.github.com/jed/982883
function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) }