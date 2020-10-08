<template>
  <form @submit.prevent="submit">
    <b-message
      v-if="$fetchState.error"
      type="is-danger"
    >
      {{ $fetchState.error.message }}
    </b-message>

    <b-message
      v-if="error"
      type="is-danger"
    >
      {{ error.message }}
    </b-message>

    <b-field label="First Name">
      <b-input
        v-model="user.firstName"
        type="text"
        required
        :loading="$fetchState.pending"
      />
    </b-field>

    <b-field label="Last Name">
      <b-input
        v-model="user.lastName"
        type="text"
        required
        :loading="$fetchState.pending"
      />
    </b-field>

    <div class="field block">
      <b-radio
        v-model="user.accountType"
        native-value="individual"
      >
        Individual
      </b-radio>
      <b-radio
        v-model="user.accountType"
        native-value="business"
      >
        Business
      </b-radio>
    </div>

    <b-field
      v-if="user.accountType === 'business'"
      label="Company Name"
    >
      <b-input
        v-model="user.companyName"
        type="text"
        :loading="$fetchState.pending"
      />
    </b-field>

    <b-field label="Email Address">
      <b-input
        v-model="user.email"
        type="email"
        :loading="$fetchState.pending"
        required
      />
    </b-field>

    <div class="field block">
      <b-checkbox v-model="user.newsletter">
        Newsletter
      </b-checkbox>
    </div>

    <div class="buttons">
      <b-button
        type="is-primary"
        native-type="submit"
        :disabled="!valid || submitting"
        :loading="submitting"
      >
        Create
      </b-button>
    </div>
  </form>
</template>

<style scoped>
  .buttons {
    display: flex;
    justify-content: flex-end;
  }

  .buttons,
  .buttons * {
    margin: 0;
  }
</style>

<script>
  function uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  export default {
    data: () => ({
      user: {
        firstName: '',
        lastName: '',
        accountType: 'individual',
        companyName: '',
        email: '',
        password: uuidv4(),
        newsletter: true
      },

      error: null,
      submitting: false,
      valid: false
    }),

    watch: {
      user: {
        deep: true,
        handler () {
          this.$nextTick(() => {
            this.valid = this.$el.checkValidity()
          })
        }
      }
    },

    async fetch () {
      const ticketClient = await this.$zendesk.remote('ticket_sidebar')
      const req = await ticketClient.get('ticket.requester')
      const { name, email, tags } = req['ticket.requester']

      if (name && name !== '') {
        const [first, last] = name.split(' ')

        this.user.firstName = first
        this.user.lastName = last
      }

      if (email && email !== '') {
        this.user.email = email
      }

      if (tags.includes('business')) {
        this.user.accountType = 'business'
      }
    },

    methods: {
      async submit () {
        try {
          this.submitting = true

          const res = await this.$hal()
            .post('/accounts/users')
            .body({ data: { attributes: this.user } })
            .jsonApi()

          const ticketClient = await this.$zendesk.remote('ticket_sidebar')
          await ticketClient.set('ticket.requester.externalId', res.data.id)
          await ticketClient.trigger('reload')

          this.$zendesk.invoke('notify', 'User has been created')
          this.$zendesk.invoke('destroy')
        } catch (e) {
          this.error = e
        } finally {
          this.submitting = false
        }
      }
    }
  }
</script>
