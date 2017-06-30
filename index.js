#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// All recognized flags.
const flags = ['-n', '--name', '-a', '--author', '-s', '--structured'];

// Properties to be set by flags.
var pluginName;
var pluginAuthor;

var structured;

// Check if all flags are valid.
try {
    checkFlags();
} catch (error) {
    console.log(error.message);
    process.exit();
}

console.log(chalk.cyan("\nKRelay Plugin Boilerplate Generator by tcrane"));
console.log("Generating project with settings:");
console.log("Structured: " + (structured ? "yes" : "no"));
console.log("      Name: " + pluginName);
console.log("    Author: " + pluginAuthor);

// TODO: implement customisable output directory.
let outDir = path.join(process.cwd(), pluginName);
let filePrefix = structured ? 'st-' : 'nst-';

// Make sure output directory exists.
try {
    fs.statSync(outDir);
} catch (error) {
    console.log("\n[KGen] Creating directory: " + outDir);
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
    process.exit();
}

let modulePath = require.resolve('kgen').replace('index.js', '');

// Generate directories.
fs.mkdirSync(path.join(outDir, 'Properties'));
if(structured) {
    fs.mkdirSync(path.join(outDir, 'Core'));
    fs.mkdirSync(path.join(outDir, 'Dependencies'));
    fs.mkdirSync(path.join(outDir, 'Services'));
    fs.mkdirSync(path.join(outDir, 'Helpers'));
    fs.mkdirSync(path.join(outDir, 'Data'));
    fs.mkdirSync(path.join(outDir, 'Data', 'Models'));
    fs.mkdirSync(path.join(outDir, 'Data', 'Enums'));
    fs.mkdirSync(path.join(outDir, 'Data', 'Events'));
    fs.mkdirSync(path.join(outDir, 'Data', 'Interfaces'));
}

// Copy Lib K Relay.
let libPath = structured ? path.join(outDir, 'Dependencies', 'Lib K Relay.dll') : path.join(outDir, 'Lib K Relay.dll');
fs.createReadStream(path.join(modulePath, 'src', 'template', 'Lib K Relay.dll')).pipe(fs.createWriteStream(libPath));

// Generate Assembly info.
let guid = b();
let assemblyInfo = fs.readFileSync(path.join(modulePath, 'src', 'template', (filePrefix + 'AssemblyInfo.cs')), { encoding: 'utf8', flag: 'r' });
assemblyInfo = assemblyInfo.replace(/%NAME%/g, pluginName);
assemblyInfo = assemblyInfo.replace(/%GUID%/g, guid);
fs.writeFileSync(path.join(outDir, 'Properties', 'AssemblyInfo.cs'), assemblyInfo, { encoding: 'utf8', flag: 'w' });

// Generate Project file.
let projectFile = fs.readFileSync(path.join(modulePath, 'src', 'template', (filePrefix + 'Project.csproj')), { encoding: 'utf8', flag: 'r' });
projectFile = projectFile.replace(/%NAME%/g, pluginName);
projectFile = projectFile.replace(/%GUID%/g, guid.toUpperCase());
fs.writeFileSync(path.join(outDir, pluginName + '.csproj'), projectFile, { encoding: 'utf8', flag: 'w' });

// Generate Plugin.cs
let pluginFile = fs.readFileSync(path.join(modulePath, 'src', 'template', (filePrefix + 'Plugin.cs')), { encoding: 'utf8', flag: 'r' });
pluginFile = pluginFile.replace(/%NAME%/g, pluginName);
pluginFile = pluginFile.replace(/%AUTHOR%/g, pluginAuthor);
let pluginFilePath = structured ? path.join(outDir, 'Core', 'Plugin.cs') : path.join(outDir, 'Plugin.cs');
fs.writeFileSync(pluginFilePath, pluginFile, { encoding: 'utf8', flag: 'w' });


console.log(chalk.green('[KGen] Done!'));
console.log(chalk.green('----------------'));
console.log("Project '" + pluginName + "' generated at: " + outDir);

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