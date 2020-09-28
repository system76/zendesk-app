<template>
  <div>
    <h2 class="u-fs-lg u-mb-sm">an error has occured</h2>

    <div>
      <button
        class="c-btn"
        @click="refresh"
      >
        Refresh
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({ statusCode: 404 })
    }
  },

  created () {
    const { path, query } = this.$route

    if (this.error.statusCode === 404 && path.endsWith('.html')) {
      this.$router.push(path.replace('/index.html', ''))
    }
  },

  methods: {
    refresh () {
      window.location.reload()
    }
  }
}
</script>
