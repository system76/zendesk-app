<template>
  <div class="head">
    <h1 class="title is-4 my-0">
      Order #{{ orderId }}
    </h1>

    <div class="buttons has-addons">
      <b-button
        href="#"
        rel="noreferrer"
        tag="a"
        target="_blank"
      >
        Joshua
      </b-button>

      <b-button
        href="lcarsUrl"
        rel="noreferrer"
        tag="a"
        target="_blank"
        type="is-primary"
      >
        LCARS
      </b-button>
    </div>
  </div>
</template>

<style scoped>
  .head {
    align-content: center;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
</style>

<script>
  export default {
    props: {
      orderId: {
        type: [String, Number],
        required: true
      }
    }
  }
</script>
