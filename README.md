# LogLady

## How to develop

You can set up your development environment on macOS simply by using this one-liner:

``` curl --silent https://raw.githubusercontent.com/kits-ab/LogLady/develop/bootstrap.sh | bash ```

## Bullsh*t, what does it really do to my mac
The script starts with install [Homebrew](https://brew.sh/)  and brew formulas which are [git](https://git-scm.com/) and [yarn](https://yarnpkg.com/lang/en/). Then, the script pulls the latest Loglady repo and install the project's dependencies that described in `packages.json`. Finally, the tests check everything works well and the development server and the application start.

Alternatively:

Start with running `npm install`.

Run `npm test` to run tests.

Run `npm run lint` to check for code errors

## Running the application as developer:

__Using Visual Studio Code (Recommended):__<br/>
Simply run the debug configuration using F5. Then, use the [Debug toolbar](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) to stop or restart the application.<br/>
A background task for React/webpack server will start if it isn't running. This task can be left running while you are developing!

__Without Visual Studio Code:__<br/>
Run  `npm run dev` to run application in developer mode with live update

## Developer tools/Debugging:

__For main process:__<br/>
If using VSCode and the debug configuration:<br/>
Output from the main electron process is in Debug Console. In VS Code breakpoints can be added to the scripts the main process executes.<br/>
Output from the background task (the webpack server) is in a Terminal tab.

Else:<br/>
Output from the main electron process is wherever you ran `npm run dev`. Debugging and breakpoints is available using the [Chrome Node Inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/#chrome-devtools-55-microsoft-edge)

__For renderer process:__<br/>
Redux Devtools and React Developer Tools are installed and can be found in the Chrome DevTools.<br/>
In the tab _Sources_ breakpoints can be added to scripts the specific window executes.


(Node version used: `8.4.0`, others (newer versions) may work as well.)

Make sure your editor of choice has plugins for ESLint and Prettier installed _(for VSCode these are recommended: [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))_, because then it will give a lot of hints for what the linter complains about.

## How to name branches and git flow

Tasks can be found in [Projects](https://github.com/kits-ab/LogLady/projects/1).

 Assign one to yourself then create branch from develop and name it `feature/whatever-you-are-doing-#corresponding-task-ID`.

Example: `feature/branchName-#5`

 **Note:** _feature_ is an example, it could be:

- feature
- hotfix
- release

Commit messages should start with task ID

Example: `#5 update README. Explained naming.`

Push when done. Make pull request where you add task ID to beginning of comment.

## Useful links

_Learn Javascript and Node_

- [Learn Node - Learning Path](https://developer.ibm.com/series/learn-node-learning-path)
- [JavaScript 30](https://javascript30.com)
- [Node JS Docs](https://nodejs.org/docs)
- [How to Learn React — A roadmap from beginner to advanced](https://medium.freecodecamp.org/learning-react-roadmap-from-scratch-to-advanced-bff7735531b6)

_Test_

- [Mocha](https://mochajs.org)
- [Chai JS](https://www.chaijs.com)

_Code style & lint_

- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)

_React JS_

- [Official Videos](https://reactjs.org/community/videos.html)
- [Official Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Articles](https://reactjs.org/community/articles.html)
- [Courses](https://reactjs.org/community/courses.html)

_...more_

- [Electron](https://electronjs.org/)
- [Travis CI](https://docs.travis-ci.com)
- [Webpack](https://webpack.js.org/)
- [How to use package.json scripts as build tool](https://scotch.io/tutorials/using-npm-as-a-build-tool)
- [Awesome Electron Links](https://github.com/sindresorhus/awesome-electron)

## Project Overview

#### Context

![Context Overview](docs/Context.png 'Context')

#### Containers

![Containers](docs/Containers.png 'Containers')

#### Continous Integration

![Continous Integration](docs/CI.png 'Continous Integration')

### Message Flow
* Source - Source of log data, e.g. files, console output.
* Adapter - A module specialized for reading a particular kind of input
* Engine - Aggregates and buffers data
* Display - UI display device
* Export - Exports data to other formats

#### Source
Source|Adapter|Engine|Display/Export
-----|-------|------|--------------
Generator change|Adapter reads|Engine notifies listeners|Listeners can read change if relevant
#### Random Input
Seekable Source|Adapter|Engine|Display/Export
-----|-------|------|--------------
Device reads block|Adapter reads|Engine notifies listeners|Listeners can read change if relevant
#### Scan Input
Seekable Source|Adapter|Engine|Display/Export
-----|-------|------|--------------
Complete scan with filter|Adapter reads|Engine notifies listeners|Listeners can read change if relevant
#### Random Seek
Display/Export|Engine|Adapter
--------------|------|-------
Display/Export requests data at position|Engine notifies Adapter|Adapter starts random input cycle
#### Full Scan
Display/Export|Engine|Adapter
--------------|------|-------
Display/Export requests full data scan|Engine notifies Adapter|Adapter starts scan input cycle
