<template>
  <housecat :images="images">
    <template scope="props">
      <a class="image" href="#">
        {{ props.image.width }}&times;{{ props.image.height }}
      </a>
    </template>
  </housecat>
</template>

<script>
import Housecat from './index'

export default {
  components: { Housecat },

  data () {
    // Generate random images
    const images = Array(250).fill().map(image => ({
      width: parseInt(640 + Math.random() * 2048),
      height: parseInt(480 + Math.random() * 1536)
    }))

    return { images }
  }
}
</script>

<style>
body {
  font-family: system-ui;
  margin: 0;
  padding: 3rem;
}

a.image {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  font-size: 2em;
}

a.image:hover {
  opacity: 1;
  text-decoration: none;
}
</style>
