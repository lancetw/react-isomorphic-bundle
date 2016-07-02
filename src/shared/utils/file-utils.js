export function getFileExt (filename) {
  return filename.split('.').pop()
}

export function getFileName (filename) {
  return filename.split('/').pop()
}

export function checkImageFile (file) {
  if (getFileExt(file) === 'pdf' ||
      getFileExt(file) === 'doc' ||
      getFileExt(file) === 'docx') {
    return false
  }

  return true
}
