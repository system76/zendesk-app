<template>
  <div class="head">
    <h1 class="title is-4 my-0">
      Order #{{ orderId }}
    </h1>

    <div class="buttons has-addons">
      <b-button
        :href="joshuaUrl"
        rel="noreferrer"
        tag="a"
        target="_blank"
      >
        Joshua
      </b-button>

      <b-button
        :href="lcarsUrl"
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
  import { mapState } from 'vuex'

  export default {
    props: {
      orderId: {
        type: [String, Number],
        required: true
      }
    },

    computed: {
      ...mapState('context', ['site']),

      joshuaUrl () {
        return `https://${this.site}.com/admin/service/order/${this.orderId}`
      },

      lcarsUrl () {
        return `https://admin.${this.site}.com/fulfillment/orders/${this.orderId}`
      }
    }
  }
</script>
