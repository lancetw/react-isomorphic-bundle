export function getFileExt (filename) {
  return filename.split('.').pop()
}

export function getFileName (filename) {
  return filename.split('/').pop()
}
