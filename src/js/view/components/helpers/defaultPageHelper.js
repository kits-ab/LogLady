export const osSpecificKeyBindings = () => {
  return `${window.navigator.platform.startsWith('Mac') ? 'cmd' : 'ctrl'}`;
};
