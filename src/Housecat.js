export default class Housecat {
  constructor (opts = {}) {
    Object.assign(this, {
      containerWidth: 800,
      gutter: 5,
      images: [],
      rowHeight: 225,
      squeezeRatio: 2 / 3
    }, opts)

    this.rows = []
  }

  get images () {
    return this._scaledImages
  }

  set images (images) {
    this._scaledImages = images.map(image => {
      const scaledWidth = this.rowHeight * image.width / image.height

      if (Number.isNaN(scaledWidth)) {
        throw new Error(`Invalid image ${JSON.stringify(image)}`)
      }

      image.scaledWidth = scaledWidth
      return image
    })

    return this._scaledImages
  }

  computeRows () {
    let rows = []
    let row = []

    // Place images in a temp row, then push the temp row to the rows array
    // when it has reached max width size
    for (let [i, image] of this._scaledImages.entries()) {
      const rowWidthWithGutter = this.computeWidthWithGutter(row)

      const isLastImage = i === this._scaledImages.length - 1
      const imageFits = rowWidthWithGutter + image.scaledWidth < this.containerWidth
      const canBeSqueezed = rowWidthWithGutter + (image.scaledWidth * this.squeezeRatio) < this.containerWidth

      // If there is place for image, add it to the row
      // If image is small enough to be squeezed, add it to the row
      if (imageFits || canBeSqueezed) {
        row.push(image)

      // Otherwise, close current row and put image in the next one
      } else {
        rows.push(this.scaleRowImages(row))
        row = [image]
      }

      // If this is the last image, close row
      if (isLastImage) {
        rows.push(this.scaleRowImages(row))
      }
    }

    // Reset the scale for the last row if it doesn't exceed maximum container width
    const lastRow = rows[rows.length - 1]
    if (this.computeWidthWithGutter(lastRow) < this.containerWidth) {
      rows[rows.length - 1] = rows[rows.length - 1].map(image => {
        image.fitWidth = image.scaledWidth
        return image
      })
    }

    this.rows = rows
    return this.rows
  }

  scaleRowImages (row) {
    // Compute the amount of pixels to fill, minus the amount
    const widthToFill = this.containerWidth - (this.gutter * (row.length - 1))
    const rowWidthWithoutGutter = this.computeWidthWithoutGutter(row)

    // Scale every image up or down, depending on whether we have too much space or not enough
    return row.map(image => {
      image.fitWidth = image.scaledWidth * widthToFill / rowWidthWithoutGutter
      return image
    })
  }

  computeWidthWithoutGutter (row) {
    return row.reduce((total, image) => total += image.scaledWidth, 0)
  }

  computeWidthWithGutter (row) {
    return this.computeWidthWithoutGutter(row) + this.gutter * (row.length - 1)
  }
}
