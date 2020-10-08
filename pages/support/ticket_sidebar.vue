<template>
  <div v-if="!$fetchState.pending">
    <user-details
      :user-id="requester.externalId"
      @create="createUser"
    />

    <div v-if="orderId">
      <hr class="my-4">
      <order-details :order-id="orderId" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    computed: {
      ...mapGetters('support', ['getFieldValue']),
      ...mapState('support', ['requester']),

      orderId () {
        return this.getFieldValue('orderId')
      }
    },

    fetch () {
      return Promise.all([
        this.$store.dispatch('support/fetchFields'),
        this.$store.dispatch('support/fetchRequester')
      ])
    },

    methods: {
      async createUser () {
        await this.$zendesk.modal('/support/create_customer_modal')

        this.$fetch()
      }
    }
  }
</script>
