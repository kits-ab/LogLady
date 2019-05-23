import { getFormattedFilePath } from './StatusBarHelper';

export const prettifyErrorMessage = (message, error) => {
  console.log(error);
  switch (error.code) {
    case 'EACCES':
      return fileErrorMessage(message, error.path, 'permission denied');
    case 'EISDIR':
      return fileErrorMessage(message, error.path, 'is a directory');
    case 'ENOENT':
      return fileErrorMessage(message, error.path, 'does not exist');
    case 'CUSTOM':
      return `${message}, ${error.reason}`;
    default:
      return message;
  }
};

const fileErrorMessage = (message, path, addendum) => {
  return `${message} ${getFormattedFilePath(path)} ${addendum}`;
};
