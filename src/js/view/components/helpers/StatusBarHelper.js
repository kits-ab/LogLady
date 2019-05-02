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

export const getFileName = openFile => {
  const filePathToArray = openFile[0].split('/');
  return filePathToArray.map((data, i, _filePathToArray) => {
    let fileName;
    if (_filePathToArray.length === i + 1) {
      fileName = data;
    }
    return fileName;
  });
};

export const getFormattedFilePath = filePath => {
  const filePathToArray = filePath.split('/');
  if (filePathToArray.length > 4) {
    const shortFilePath = filePathToArray.slice(-3);
    return (
      '...' + shortFilePath[0] + '/' + shortFilePath[1] + '/' + shortFilePath[2]
    );
  }
  return filePath;
};
