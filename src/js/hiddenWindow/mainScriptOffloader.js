/* eslint-disable no-unused-vars */
/**
 * This file is used to offload work from the main process.
 * It was created for #258 for filtering logs in another thread, check PR #331 for more info.
 * Usage:
 * - Main window sends an array of lines to filter and highlight using IPC
 * - This helper then starts working through these lines, sending them back using IPC when finished or as it's going.
 */

/**
 * Class for filtering and highlighting lines of text
 * @class
 */
class LogsFiltererAndHighlighter {
  /**
   * Create a new filterer and highlighter
   * @param {string[]} logsToFilter - An array of lines to filter
   * @param {string} logsPath - The path the lines are associated to
   * @param {RegExp|undefined} filterRegex - The regex to use for filtering, or undefined if nothing should be filtered
   * @param {RegExp|undefined} highlightRegex - The regex to use for highlighting, or undefined if nothing should be highlighted
   */
  constructor(logsToFilter, logsPath, filterRegex, highlightRegex) {
    this.lines = logsToFilter;
    this.path = logsPath;
    this.filterRegex = filterRegex;
    this.highlightRegex = highlightRegex;
  }

  /**
   * Loops through all lines, filtering and highlighting them using the regexes supplied.
   * Will try to highlight if filter matches or filter is not set
   * Highlighting works by wrapping the entire line with [HLL] and [/HLL],
   * and wrapping words with [HLG(number)] and [/HLG(number)]
   * @public
   * @param {boolean} [sendLinesOneByOne=false]
   */
  start(sendLinesOneByOne = false) {
    let filteredAndHighlightedLines = [];
    for (let lineIndex in this.lines) {
      let line = this.lines[lineIndex];

      // Continue to try to highlight if the filter matches the line or if no filter is set
      if (
        filterExistsAndMatchesWithLineOrHasFilterNotBeenSet(
          this.filterRegex,
          line
        )
      ) {
        let lineObj = getHighlightedLineIfHighlightExistsAndMatches(
          this.highlightRegex,
          line
        );

        if (sendLinesOneByOne) {
          this._sendLineToMainWindow(lineObj);
        } else {
          filteredAndHighlightedLines.push(lineObj);
        }
      }
    }
    if (!sendLinesOneByOne) {
      this._sendAllLinesToMainWindow(filteredAndHighlightedLines);
    }
  }

  /**
   * Send a single line back to the main window through IPC
   * @private
   * @param {string} line - The line to send
   */
  _sendLineToMainWindow(line) {
    window.ipcRenderer.send('hiddenWindowMessages', {
      type: 'serveFilteredLogsOneDone',
      path: this.path,
      line
    });
  }

  /**
   * Send an array of lines back to the main window through IPC
   * @private
   * @param {string[]} line - The lines to send
   */
  _sendAllLinesToMainWindow(lines) {
    window.ipcRenderer.send('hiddenWindowMessages', {
      type: 'serveFilteredLogsAllDone',
      path: this.path,
      lines: lines
    });
  }
}

const filterExistsAndMatchesWithLineOrHasFilterNotBeenSet = (
  filterRegex,
  line
) => {
  return (filterRegex && filterRegex.test(line)) || !filterRegex;
};

const getHighlightedLineIfHighlightExistsAndMatches = (
  highlightRegex,
  line
) => {
  let lineObj = {};
  let length = typeof line !== 'undefined' ? line.length : 0;

  console.log({ length });
  if (highlightRegex && highlightRegex.test(line)) {
    lineObj = {
      highlightLine: true,
      sections: line.split(highlightRegex).map(value => {
        return {
          text: value,
          highlightSection: highlightRegex.test(value)
        };
      }),
      length
    };
  } else {
    lineObj = {
      highlightLine: false,
      sections: [{ text: line, highlightSection: false }],
      length
    };
  }
  return lineObj;
};

/**
 * Register a listener for messages from the main window addressed to here.
 * Remember that the message has been stringified/serialized!
 * The message argument should contain these parameters:
 * @param {object} args - A object that was sent with the message.
 * @param {string} args.type - The type of request
 * @param {string} args.filterRegexString - The regex to use for filtering converted to a string, or an empty string
 * @param {string} args.highlightRegexString - The regex to use for highlighting converted to a string, or an empty string
 * @param {string} args.path - The path the logs are associated with
 * @param {object} args.logs - An object that contains all of the logs to filter and highlighted, fieldnames of the object should be the path the logs are associated with and the field properties should be an array with the line
 * @param {boolean} [args.sendLinesOneByOne=false] - If the lines should be sent back immediately after they are handled, or as a bulk when all are done.
 */
window.ipcRenderer.on('hiddenWindowMessages', (event, args) => {
  if (args.type === 'requestHelpFilterAndHighlightLines') {
    let filterRegex, highlightRegex;
    // Expect args.filterRegexString to either be a RegEx converted to string, or an empty string
    //  /\/(.*)\/(.*)/ is a regex for capturing two groups (pattern and flags) in a stringified regex, e.g "/(?:)/gi"
    if (args.filterRegexString) {
      let [, pattern, flags] = /\/(.*)\/(.*)/.exec(args.filterRegexString);
      filterRegex = new RegExp(`(${pattern})`, flags);
    }
    if (args.highlightRegexString) {
      let [, pattern, flags] = /\/(.*)\/(.*)/.exec(args.highlightRegexString);
      flags = flags.indexOf('g') === -1 ? flags + 'g' : flags;
      highlightRegex = new RegExp(`(${pattern})`, flags);
    }

    // Create a new filterer and highlighter for this path in the logs that was sent and then start filtering
    const filtererForThisPath = new LogsFiltererAndHighlighter(
      args.logs,
      args.path,
      filterRegex,
      highlightRegex
    );
    filtererForThisPath.start(args.sendLinesOneByOne);
  }
});

module.exports = {
  filterExistsAndMatchesWithLineOrHasFilterNotBeenSet,
  getHighlightedLineIfHighlightExistsAndMatches
};
