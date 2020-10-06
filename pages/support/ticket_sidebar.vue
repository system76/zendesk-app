<template>
  <div>
    <div v-if="userId">
      <user-details :user-id="userId" />
    </div>

    <div v-if="orderId">
      <hr class="my-4">
      <order-details :order-id="orderId" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      userId: null
    }),

    computed: {
      ...mapGetters('support', ['getFieldValue']),

      orderId () {
        return this.getFieldValue('orderId')
      },
    },

    async fetch () {
      await this.fetchUser()
    },

    methods: {
      async fetchUser () {
        const externalIdData = await this.$zendesk.get('ticket.requester.externalId')
        this.userId = externalIdData['ticket.requester.externalId']
      }
    }
  }
</script>
