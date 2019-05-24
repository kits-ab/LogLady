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

//const signToSplit = () => {
//return `${navigator.platform.startsWith('Win') ? '\\' : '/'}`;
//};

export const getFormattedFilePath = (filePath, signToSplit) => {
  //const sign = signToSplit();
  const filePathToArray = filePath.split(signToSplit);

  if (filePathToArray.length > 4) {
    const shortFilePath = filePathToArray.slice(-3);
    return (
      '...' +
      shortFilePath[0] +
      signToSplit +
      shortFilePath[1] +
      signToSplit +
      shortFilePath[2]
    );
  }
  return filePath;
};
