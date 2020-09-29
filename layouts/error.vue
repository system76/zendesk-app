<template>
  <div>
    <h2 class="u-fs-lg u-mb-sm">
      {{ statusCode }} - {{ message }}
    </h2>

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

    computed: {
      message () {
        return this.error.message || 'An error has occured'
      },

      statusCode () {
        return this.error.statusCode || 404
      }
    },

    methods: {
      refresh () {
        window.location.reload()
      }
    }
  }
</script>
