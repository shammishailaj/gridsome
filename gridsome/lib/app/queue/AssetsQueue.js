const path = require('path')
const isUrl = require('is-url')
const mime = require('mime-types')
const FileProcessQueue = require('./FileProcessQueue')
const ImageProcessQueue = require('./ImageProcessQueue')

class AssetsQueue {
  constructor (app) {
    this.app = app
    this.files = new FileProcessQueue(app)
    this.images = new ImageProcessQueue(app)
  }

  async add (filePath, options) {
    const { config, context } = this.app
    const { ext } = path.parse(filePath)
    const isImage = config.imageExtensions.includes(ext)

    const data = {
      type: isImage ? 'image' : 'file',
      mimeType: mime.lookup(filePath),
      filePath
    }

    // TODO: process external files and images
    if (isUrl(filePath) || !filePath.startsWith(context)) {
      return { ...data, src: filePath }
    }

    const results = isImage
      ? await this.images.add(filePath, options)
      : await this.files.add(filePath, options)

    return { ...data, ...results }
  }
}

module.exports = AssetsQueue
