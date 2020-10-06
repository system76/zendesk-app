<template>
  <div>
    <b-field label="Name">
      <b-input v-model="customer.name" />
    </b-field>

    <b-button @click="close">
      Close
    </b-button>
  </div>
</template>

<script>
  export default {
    data: () => ({
      customer: {
        name: ''
      }
    }),

    methods: {
      async close () {
        await this.$zendesk.invoke('destroy')
      },

      save () {
        this.$emit('close')
      }
    }
  }
</script>
