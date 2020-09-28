<template>
  <div>
    <div
      v-if="fields.orderId"
      class="u-mb"
    >
      <h2 class="u-fs-lg u-mb-sm">Order {{ fields.orderId }}</h2>

      <div>
        <a
          :href="`https://admin.genesis76.com/fulfillment/orders/${fields.orderId}`"
          class="c-btn"
          target="_blank"
        >
          LCARS
        </a>

        <a
          :href="`https://genesis76.com/admin/service/order/${fields.orderId}`"
          class="c-btn"
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
      <h2 class="u-fs-lg u-mb-sm">User {{ user.id }}</h2>

      <div>
        <a
          :href="`https://admin.genesis76.com/account/customers/${user.id}`"
          class="c-btn"
          target="_blank"
        >
          LCARS
        </a>

        <a
          :href="`https://genesis76.com/admin/service/customer/${user.id}`"
          class="c-btn"
          target="_blank"
        >
          Joshua
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import camelCase from 'lodash/camelCase'

export default {
  data: () => ({
    fields: {
      orderId: null
    },

    user: {
      id: null
    }
  }),

  async fetch () {
    await Promise.all([
      this.fetchFields(),
      this.fetchUser()
    ])
  },

  methods: {
    async fetchFields () {
      const fieldData = (await this.$zendesk.get('ticketFields'))
        .ticketFields
        .filter((f) => (f.label != null && f.name != null))

      const fieldNames = fieldData
        .map((f) => f.name)
        .filter((f) => !['problem', 'sharedWith', 'collaborator'].includes(f))
        .map((f) => `ticket.customField:${f}`)

      const fieldValues = await this.$zendesk.get(fieldNames)

      Object.entries(fieldValues).forEach(([k, v]) => {
        if (k !== 'errors') {
          const fieldName = fieldData.find((f) => (`ticket.customField:${f.name}` === k))
          this.fields[camelCase(fieldName.label)] = v
        }
      })
    },

    async fetchUser () {
      const externalIdData = await this.$zendesk.get('ticket.requester.externalId')

      this.user.id = externalIdData['ticket.requester.externalId']
    }
  }
}
</script>
