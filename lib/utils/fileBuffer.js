const stringBuffer = require('./stringBuffer')

function fileBuffer(bufferName) {
  const files = {}
  return (filename) => {
    if(filename != null) {
      let file = {}
      let fileContent = stringBuffer()
      file[bufferName] = (...args) => {
        fileContent(...args)
        return file
      }
      file.content = fileContent
      file.toString = () => filename
      files[filename] = file
      return file
    }
    return files
  }
}

module.exports = fileBuffer