const addRecentFile = (recentFiles, file, size = 3) => {
  const updated = recentFiles.filter(f => {
    return f !== file;
  });

  updated.unshift(file);
  if (updated.length > size) {
    updated.pop();
  }

  return updated;
};

module.exports = {
  addRecentFile
};
