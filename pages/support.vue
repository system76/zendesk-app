<template>
  <nuxt-child />
</template>

<script>
  export default {
    fetch () {
      this.$store.dispatch('support/fetchFields')
    }
  }
</script>
