<template>
<div
  ref="container"
  v-resize="resizeBegin"
  v-resize:debounce.100="resize"
  class="housecat"
  :class="{ 'housecat__is-resizing': isResizing }"
>
  <virtual-scroller
    page-mode
    :items="housecat.rows"
    :item-height="rowHeight"
    class="scroller"
  >
    <template scope="props">
      <div
        :style="{ height: rowHeight + 'px' }"
        class="row"
      >
        <div
          v-for="image in props.item"
          :key="image.id"
          :style="{
            width: image.fitWidth + 'px',
            height: rowHeight + 'px',
            'background-image': `url(http://placehold.it/${parseInt(image.scaledWidth)}x${rowHeight})`
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
    const housecat = new Housecat()

    housecat.images = Array(250).fill().map(image => {
      const id = Math.random().toString(16).slice(2)

      const width = parseInt(640 + Math.random() * 2048)
      const height = parseInt(480 + Math.random() * 1536)

      return { id, width, height }
    })

    return {
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
      const width = el.clientWidth - parseFloat(left) - parseFloat(right)

      this.housecat.computeRows(width)
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

.row {
  margin-bottom: 5px;
}

.image {
  float: left;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.05);
}

.image + .image {
  margin-left: 5px;
}
</style>
