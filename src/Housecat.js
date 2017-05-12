export default class Housecat {
  constructor (opts = {}) {
    Object.assign(this, {
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

  computeRows (containerWidth) {
    let rows = []
    let row = []

    // Place images in a temp row, then push the temp row to the rows array
    // when it has reached max width size
    for (let [i, image] of this._scaledImages.entries()) {
      const rowWidthWithGutter = this.computeWidthWithGutter(row)

      // If we have the place left to place another image, add it to the row
      if (rowWidthWithGutter + image.scaledWidth < containerWidth) {
        row.push(image)

      // If we don't, move on to closing the row
      } else {
        // If there is place for part of the image to come, add it to the row
        if (rowWidthWithGutter + (image.scaledWidth * this.squeezeRatio) < containerWidth) {
          row.push(image)
        }

        // Compute the amount of pixels to fill, minus the amount
        const widthToFill = containerWidth - (this.gutter * (row.length - 1))
        const rowWidthWithoutGutter = this.computeWidthWithoutGutter(row)

        // Scale every image up or down, depending on whether we have too much space or not enough
        row.map(image => {
          image.fitWidth = image.scaledWidth * widthToFill / rowWidthWithoutGutter
          return image
        })

        // Add row to the rows array and reset it
        rows.push(row)
        row = []
      }
    }

    // Reset the scale for the last row
    rows[rows.length - 1] = rows[rows.length - 1].map(image => {
      image.fitWidth = image.scaledWidth
      return image
    })

    this.rows = rows
    return this.rows
  }

  computeWidthWithoutGutter (row) {
    return row.reduce((total, image) => total += image.scaledWidth, 0)
  }

  computeWidthWithGutter (row) {
    return this.computeWidthWithoutGutter(row) + this.gutter * (row.length - 1)
  }
}
