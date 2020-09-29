<template>
  <div>
    <div
      v-if="orderId"
      class="u-mb"
    >
      <h2 class="u-mb-sm">
        Order {{ orderId }}
      </h2>

      <div>
        <a
          :href="`https://admin.${site}.com/fulfillment/orders/${orderId}`"
          class="c-btn c-btn--sm"
          target="_blank"
        >
          LCARS
        </a>

        <a
          :href="`https://${site}.com/admin/service/order/${orderId}`"
          class="c-btn c-btn--sm"
          target="_blank"
        >
          Joshua
        </a>
      </div>
    </div>

    <div
      v-if="user.id"
      class="u-mb"
    >
      <h2 class="u-mb-sm">
        User {{ user.id }}
      </h2>

      <div>
        <a
          :href="`https://admin.${site}.com/account/customers/${user.id}`"
          class="c-btn c-btn--sm"
          target="_blank"
        >
          LCARS
        </a>

        <a
          :href="`https://${site}.com/admin/service/customer/${user.id}`"
          class="c-btn c-btn--sm"
          target="_blank"
        >
          Joshua
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    data: () => ({
      user: {
        id: null
      }
    }),

    computed: {
      ...mapState('context', ['site']),
      ...mapGetters('support', ['getFieldValue']),

      orderId () {
        return this.getFieldValue('orderId')
      }
    },

    async fetch () {
      await Promise.all([
        this.fetchUser()
      ])
    },

    methods: {
      async fetchUser () {
        const externalIdData = await this.$zendesk.get('ticket.requester.externalId')

        this.user.id = externalIdData['ticket.requester.externalId']
      }
    }
  }
</script>
