export default (imagePath) => {
  if (process.env.BROWSER)
    throw new Error('image-resolver called on browser')
  else {
    let images
    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs')
      const path = require('path')
      images = fs.readFileSync(
        path.resolve(__dirname, '../../../storage/webpack-stats.json')
      )
      images = JSON.parse(images).images
    }
    else images = require('../../../storage/webpack-stats.json').images

    const regex = new RegExp(`${imagePath}$`)
    const image = images.find(img => regex.test(img.original))

    if (image)
      return image.compiled

    return ''
  }
}
