<template>
<div
  ref="container"
  v-resize="resizeBegin"
  v-resize:debounce.100="resize"
  class="housecat"
  :class="{ 'housecat__is-resizing': isResizing }"
  :style="{ 'margin-top': (-1 * gutter) + 'px' }"
>
  <virtual-scroller
    page-mode
    :items="housecat.rows"
    :item-height="rowHeight + gutter"
    class="scroller"
  >
    <template scope="props">
      <div
        :style="{
          height: rowHeight + 'px',
          'margin-top': gutter + 'px'
        }"
        class="row"
      >
        <div
          v-for="image, i in props.item"
          :key="image.id"
          :style="{
            width: image.fitWidth + 'px',
            height: rowHeight + 'px',
            'margin-right': (i === (props.item.length - 1) || props.item.length === 1 ? 0 : gutter + 'px'),
            'background-color': image.color,
            'background-image': `url(http://placehold.it/${parseInt(fixedThumbnails ? image.scaledWidth : image.fitWidth)}x${rowHeight})`
          }"
          class="image"
        ></div>
      </div>
    </template>
  </virtual-scroller>
</div>
</template>

<script>
import Resize from 'vue-resize-directive'

import Housecat from './Housecat'

export default {
  directives: {
    Resize
  },

  data () {
    // When enabled, will only load 1 size of thumbnail per row size.
    // Results in better performance, O(n) server load, but bad quality
    // in some intense stretching cases.
    const fixedThumbnails = true

    const gutter = 5
    const housecat = new Housecat({ gutter })

    housecat.images = Array(250).fill().map(image => {
      const id = Math.random().toString(16).slice(2)

      const width = parseInt(640 + Math.random() * 2048)
      const height = parseInt(480 + Math.random() * 1536)

      return { id, width, height }
    })

    return {
      fixedThumbnails,
      gutter,
      housecat,
      isResizing: false,
      rowHeight: 223,
    }
  },

  mounted () {
    this.resize(this.$refs.container)
  },

  methods: {
    resizeBegin () {
      this.isResizing = true
    },

    resize (el) {
      const { paddingLeft: left, paddingRight: right } = getComputedStyle(el)
      this.housecat.containerWidth = el.clientWidth - parseFloat(left) - parseFloat(right)
      this.housecat.computeRows()

      this.isResizing = false
    }
  }
}
</script>

<style>
body {
  font-family: system-ui;
  margin: 0;
}

.housecat {
  padding: 3rem;
}

.housecat__is-resizing .row {
  background: rgba(0, 0, 0, 0.05);
}

.housecat__is-resizing .row .image {
  visibility: hidden;
}

.image {
  float: left;
  max-width: 100%;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
