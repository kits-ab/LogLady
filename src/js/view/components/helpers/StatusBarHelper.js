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

export const getFormattedFilePath = filePath => {
  const sign = signToSplit();
  const filePathToArray = filePath.split(sign);

  if (filePathToArray.length > 4) {
    const shortFilePath = filePathToArray.slice(-3);
    return (
      '...' +
      shortFilePath[0] +
      sign +
      shortFilePath[1] +
      sign +
      shortFilePath[2]
    );
  }
  return filePath;
};

const signToSplit = () => {
  return `${navigator.platform.startsWith('Win') ? '\\' : '/'}`;
};
