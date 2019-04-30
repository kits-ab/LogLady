export const osSpecificKeyBindings = () => {
  return `Open File: ${
    window.navigator.platform.match('mac') ? 'cmd' : 'ctrl'
  } + O`;
};
