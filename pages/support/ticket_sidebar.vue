<template>
  <div>
    <div
      v-if="fields.orderId"
      class="u-mb"
    >
      <h1 class="label">
        Order {{ fields.orderId }}
      </h1>

      <div>
        <b-button
          :href="`https://admin.system76.com/fulfillment/orders/${fields.orderId}`"
          tag="a"
          target="_blank"
          type="is-primary"
        >
          LCARS
        </b-button>

        <b-button
          :href="`https://system76.com/admin/service/order/${fields.orderId}`"
          tag="a"
          target="_blank"
        >
          Joshua
        </b-button>
      </div>
    </div>

    <div
      v-if="user.id"
      class="u-mb"
    >
      <h1 class="label">
        User {{ user.id }}
      </h1>

      <div>
        <b-button
          :href="`https://admin.system76.com/account/customers/${user.id}`"
          tag="a"
          target="_blank"
          type="is-primary"
        >
          LCARS
        </b-button>

        <b-button
          :href="`https://system76.com/admin/service/customer/${user.id}`"
          tag="a"
          target="_blank"
        >
          Joshua
        </b-button>
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
