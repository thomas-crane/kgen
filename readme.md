# kgen
A Node.js based Command Line Interface for generating KRelay Plugin boilerplate code.

+ [Installation](#installation)
+ [Usage](#usage)
+ [More Info](#more-info)
+ [Contributing](#more-info)

## Installation
To install kgen, 3 other programs are required:
+ [Git](https://git-scm.com/downloads)
+ [Node.js](https://nodejs.org/en/download/)
+ [npm](https://www.npmjs.com/) _Note: NPM cannot be downloaded on it's own. It is installed when Node.js is installed._

To check if you already have these programs installed or to verify the installation, use the commands:
+ `node -v` to check the version of Node.js installed
+ `npm -v` to check the version of npm installed, and
+ `git -v` to check the version of git installed.

Once Node.js is installed, kgen can be installed in 3 commands:
```
Current Directory | Command to use
-----------------------------------
c:\documents      | git clone https://github.com/thomas-crane/kgen.git
c:\documents      | cd kgen
c:\documents\kgen | npm install -g
```
> Note: kgen does ___not___ have to be cloned to the documents folder. The code above is just an example.

#### `git clone ...`
This command copies the code on github into a subfolder of the current directory of the console. The subfolder has the same name as the repo, in this case 'kgen'.

#### `cd kgen`
This changes the directory of the console to the newly cloned code.

#### `npm install -g`
This command is part of `npm`. It installs the package in the current directory. Because of the `-g` flag, the package is installed globally.
This means that the command `kgen` can now be used as a console command.

You can verify that kgen is installed by typing `kgen` in the console. You should see the error `[KGen] No name specified.`

## Usage
+ [Flags](#flags)
+ [Generating a Plugin](#generating-a-plugin)
### Flags
kgen uses flags to describe the project it will generate. There are 3 flags:
```
Short | Full
--------------
   -n | --name
   -a | --author
   -s | --structured
```
#### `--name`
> or `-n`
>
> _This flag is required_

The `--name` flag is used to give the project a name. The name _should_ be a [valid C# project name](#valid-project-names), although there will be no error if it is not valid.
> _Example_
>
> `kgen --name MyKRelayPlugin2 ...`

#### `--author`
> or `-a`
>
> _This flag is required_

The value for the author flag should be inside quotes (`""`) if there are spaces in it. The value of the flag will become the author of the plugin when it is generated.
> _Example_
>
> `kgen --author tcrane ...`

#### `--structured`
> or `-s`

The structured flag determines the structure of the generated plugin. Unlike the other 2 flags, this flag does not require a value because it is a boolean. If the flag is not included, the value of structured will be false. If it is included, the value will be true.
> _Example_
>
> `kgen --structured ...`

If the structured flag is not included, the structure of the generated KRelay plugin will be:
```
MyPlugin
 `- Properties
     `- AssemblyInfo.cs
  - Plugin.cs
  - Lib K Relay.dll
```
This structure is best suited for a small plugin which only needs 1 or 2 classes.

If the flag is included, the project will have a much bigger structure
```
MyPlugin
 `- Properties
     `- AssemblyInfo.cs
  - Core
     `- Plugin.cs
  - Dependencies
     `- Lib K Relay.dll
  - Data
     `- Models
      - Events
      - Enums
      - Interfaces
  - Services
  - Helpers
```
This structure is best suited for a larger project where good organisation is very important.

_Note: The project will already have a reference to Lib K Relay regardless of it's structure._

### Generating a Plugin
To generate a plugin you should first navigate the console to the folder you want to generate the plugin in. E.g. If you want to generate a plugin in your documents, the console should be at `C:\User\Documents\` or similar. The plugin will be generated in a subfolder which will have the same name as the plugin (_The value of the `--name` flag_).

E.g. If the console is at `C:\User\Documents`, the command

`kgen -n MyPlugin -a tcrane`

Will generate a new folder:

`C:\User\Documents\MyPlugin`

And place the plugin files there.

The plugin files which are generated are:
+ `Lib K Relay.dll`
+ A `.csproj` file which already has a reference to `Lib K Relay.dll`
+ An `AssemblyInfo.cs` file which exposes info about the `.csproj` through reflection.
+ `Plugin.cs` Which will already have `IPlugin` implemented and the name and author replaced with the provided values.

If the plugin is structured, some folders are generated as well.

## More info
### Notes
Opening a newly generated project in Visual Studio can take slightly longer the first time because Visual Studio has to generate some folders in the project.

### Examples
Generating a structured plugin called `FameBot` by `tcrane` in the `C:\dev\rotmg\plugins` folder.
> 1. Navigate the console to `C:\dev\rotmg\plugins`
> 2. `kgen -n FameBot -a tcrane -s`

Generating a simple plugin called `RealmClosedNotifier` by `Tom Crane`
> `kgen -n RealmClosedNotifier -a "Tom Crane"`

### Valid Project Names
Although any string can be provided for the value of `--name` it is best to use a valid C# project name.
[This StackOverflow discussion](https://stackoverflow.com/questions/773557/which-characters-are-allowed-in-a-vs-project-name) shows that a project name cannot:
+ contain any of the following characters: `/` `?` `:` `&` `\` `*` `"` `<` `>` `|` `#` `%`
+ contain Unicode control characters
+ contain surrogate characters
+ be system reserved names, including `CON`, `AUX`, `PRN`, `COM1` or `LPT2`
+ be `.` or `..`

## Contributing
This project is written in `JavaScript` with some template files in `C#` and run in a `Node.js` environment. Make sure you have the prerequisites installed for `Node.js`.

Make sure to keep formatting and naming conventions consistent with what is already present.
+ Variable names, Function names and Function parameters are in `camelCase` so they should be `namedLikeThis`
+ The opening bracket of a block `{` should be placed on the same line as the statement, e.g. `if(...) {`
+ The `catch` or `else` line should be on the same line as the closing bracket of a block `}` e.g. `} catch(...)`
+ Indent using 4 spaces.

I highly recommend [Visual Studio Code](https://code.visualstudio.com/) as the IDE when developing Node.js/JavaScript applications. I also use [Cmder](http://cmder.net/) which is a Windows console emulator with great support for git and Node.js