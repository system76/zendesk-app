<template>
  <div>
    <div v-if="userId">
      <user-details :user-id="userId" />
    </div>

    <div v-if="fields.orderId">
      <hr class="my-4">
      <order-details :order-id="fields.orderId" />
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

      userId: null
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
        this.userId = externalIdData['ticket.requester.externalId']
      }
    }
  }
</script>
