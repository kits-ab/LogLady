export const getFormattedFileSize = fileSize => {
  if (fileSize >= 1000000000) {
    return `${(fileSize / 1000000000).toFixed(2)} gigabytes`;
  } else if (fileSize >= 1000000) {
    return `${(fileSize / 1000000).toFixed(2)} megabytes`;
  } else if (fileSize >= 1000) {
    return `${(fileSize / 1000).toFixed(2)} kilobytes`;
  } else if (fileSize) {
    return `${fileSize} bytes`;
  } else {
    return `${0} bytes`;
  }
};