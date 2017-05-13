<template>
<div
  class="housecat"
  ref="container"
  v-resize="resizeBegin"
  v-resize:debounce.100="resizeEnd"
  :class="{ 'housecat--is-resizing': isResizing }"
  :style="{ 'margin-top': `${-1 * gutter}px` }"
>
  <virtual-scroller
    :items="grid.rows"
    :item-height="rowHeight + gutter"
    page-mode
  >
    <template scope="props">
      <div
        class="housecat__row"
        :style="{ height: `${rowHeight}px`, 'margin-top': `${gutter}px` }"
      >
        <div
          class="housecat__image"
          v-for="image, i in props.item"
          :key="image.id"
          :style="{
            'width': `${image.fitWidth}px`,
            'height': `${rowHeight}px`,
            'margin-right': (i === (props.item.length - 1) || props.item.length === 1 ? 0 : `${gutter}px`),
            'background-color': image.color,
            'background-image': `url(${srcFn(image, rowHeight)})`
          }"
        >
          <slot :image="image"></slot>
        </div>
      </div>
    </template>
  </virtual-scroller>
</div>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { VirtualScroller } from 'vue-virtual-scroller/dist/vue-virtual-scroller'

import Resize from 'vue-resize-directive'

import Grid from './Grid'

export default {
  name: 'housecat',

  props: {
    // Space between images (horizontal) and rows (vertical), in pixels
    gutter: {
      type: Number,
      default: 5,
      validator: gutter => gutter >= 0
    },

    // Height of rows, in pixels
    rowHeight: {
      type: Number,
      default: 225,
      validator: rowHeight => rowHeight >= 0
    },

    // 0 to 1 float that determines if an image is small enough fit
    // in an already filled row. If the scaled image width multiplied
    // by this ratio (thus made smaller) fits into the row, will squeeze
    // the image into the current row. Otherwise, the image will be put into
    // the next row, and the current row images will be expanded to fill all
    // remaining space.
    squeezeRatio: {
      type: Number,
      default: 2 / 3,
      validator: squeezeRatio => squeezeRatio >= 0 && squeezeRatio <= 1
    },

    // Must be an array of objects with at least "width" and "height"
    // properties, which should be positive numbers
    images: {
      type: Array,
      default: [],
      validator: images => images.every(image => {
        return Number(image.width) >= 0 && Number(image.height) >= 0
      })
    },

    // Function that will be called to compute an image src,
    // receiving the image object as a first argument and the row height
    // as the second argument
    srcFn: {
      type: Function,
      default: (image, rowHeight) => {
        const w = parseInt(image.scaledWidth)
        const h = parseInt(rowHeight)
        return `http://placehold.it/${w}x${h}`
      }
    }
  },

  components: {
    'virtual-scroller': VirtualScroller
  },

  directives: {
    Resize
  },

  data () {
    const grid = new Grid({
      gutter: this.gutter,
      images: this.images,
      squeezeRatio: this.squeezeRatio
    })

    return {
      grid,
      isResizing: false
    }
  },

  mounted () {
    this.resizeEnd(this.$refs.container)
  },

  methods: {
    // Hide images in rows when resizing
    resizeBegin () {
      this.isResizing = true
    },

    resizeEnd (el) {
      // Compute and set the new container width
      const { paddingLeft: left, paddingRight: right } = getComputedStyle(el)
      this.grid.containerWidth = el.clientWidth - parseFloat(left) - parseFloat(right)

      // Compute image sizes and generate rows
      this.grid.computeRows()

      // Show images in rows
      this.isResizing = false
    }
  }
}
</script>

<style scoped>
.housecat--is-resizing .housecat__row {
  background: rgba(0, 0, 0, 0.05);
}

.housecat--is-resizing .housecat__image {
  visibility: hidden;
}

.housecat__image {
  float: left;
  max-width: 100%;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
