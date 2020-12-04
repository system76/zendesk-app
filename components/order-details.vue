<template>
  <div :class="$style.container">
    <b-loading
      v-if="$fetchState.pending"
      active
      :is-full-page="false"
    />

    <b-message
      v-else-if="$fetchState.error"
      type="is-danger"
    >
      {{ $fetchState.error.message }}
    </b-message>

    <div v-else>
      <div :class="$style.head">
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

      <b-taglist class="mt-2 mb-0 tags">
        <b-tag :type="statusType">
          {{ statusText }}
        </b-tag>
      </b-taglist>

      <div
        v-for="product in order.products"
        :key="product.id"
      >
        <hr class="my-2">
        <product-details
          :product-id="product.id"
          :open="product.model === productModel || order.products.length === 1"
        />
      </div>
    </div>
  </div>
</template>

<style module>
  .container {
    position: relative;
  }

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
      },

      productModel: {
        type: String,
        default: null
      }
    },

    async fetch () {
      this.order = await this.$hal()
        .get(`/fulfillment/orders/${this.orderId}`)
        .include('products')
        .jsonApi()
        .flatten()
    },

    computed: {
      ...mapState('context', ['site']),

      joshuaUrl () {
        return `https://joshua.${this.site}.com/admin/service/order/${this.orderId}`
      },

      lcarsUrl () {
        return `https://admin.${this.site}.com/fulfillment/orders/${this.orderId}`
      },

      statusText () {
        switch (this.order.status.toUpperCase()) {
        case 'QUOTE':
          return 'Quote'

        case 'ORDERED':
          return 'Ordered'

        case 'PROCESSING':
          return 'Processing'

        case 'PAYMENT':
          return 'Awaiting Payment'

        case 'ASSEMBLY':
          return 'Assembly'

        case 'SHIPPED_PARTIAL':
          return 'Partially Shipped'

        case 'SHIPPED_COMPLETE':
          return 'Shipped'

        case 'RETURN_PENDING':
          return 'Pending Return'

        case 'RETURN_COMPLETE':
          return 'Returned'

        case 'ADDRESS_VERIFICATION':
        case 'APPROVAL':
          return 'Approval'

        case 'CANCELLED':
        case 'REMOVED':
          return 'Cancelled'

        default:
          return this.status.charAt(0).toUpperCase() + this.status.slice(1)
        }
      },

      statusType () {
        switch (this.order.status.toUpperCase()) {
        case 'QUOTE':
          return 'is-info'

        case 'ORDERED':
        case 'PROCESSING':
        case 'PAYMENT':
        case 'ASSEMBLY':
        case 'SHIPPED_PARTIAL':
        case 'ADDRESS_VERIFICATION':
        case 'APPROVAL':
          return 'is-primary'

        case 'SHIPPED_COMPLETE':
          return 'is-success'

        case 'RETURN_PENDING':
        case 'RETURN_COMPLETE':
          return 'is-warning'

        case 'CANCELLED':
        case 'REMOVED':
          return 'is-danger'

        default:
          return ''
        }
      }
    }
  }
</script>
