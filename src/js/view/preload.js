/* Preload script that adds ipcRenderer as a global to window, needs to be done here as preload script has node integration while the rest of the renderer process does not */

const { ipcRenderer } = require('electron');

(function() {
  window.ipcRenderer = ipcRenderer;
})();
