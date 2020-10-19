<template>
  <div class="container">
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

    <div v-else-if="user.id">
      <div class="head">
        <img
          :src="avatarUrl"
          :title="title"
          :alt="title"
        >
        <div class="details">
          <h1 class="title is-4">
            {{ title }}
          </h1>
          <h2
            v-if="subtitle"
            class="subtitle is-5"
          >
            {{ subtitle }}
          </h2>
          <p
            v-if="user.phoneNumber"
          >
            {{ user.phoneNumber | phoneNumber }}
          </p>
        </div>
      </div>

      <div class="mt-2 foot">
        <b-taglist class="mt-2 mb-0 tags">
          <b-tag v-if="isBusiness">
            Business
          </b-tag>
          <b-tag v-if="user.newsletter">
            Newsletter
          </b-tag>
          <b-tag v-if="user.taxExempt">
            Tax Exempt
          </b-tag>
        </b-taglist>

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
    </div>

    <div
      v-else
      class="inline"
    >
      <h1 class="title my-0 is-4">
        Unknown User
      </h1>

      <b-button
        type="is-primary"
        @click="$emit('create')"
      >
        Create User
      </b-button>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: relative;
  }

  .head {
    display: grid;
    grid-gap: 0 2ch;
    grid-template-areas:
      "avatar details";
    grid-template-columns: auto 1fr;
  }

  .foot {
    display: grid;
    justify-content: space-between;
    grid-gap: 0 1rem;
    grid-template-columns: 1fr auto;
  }

  .inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;
  }

  img {
    background-color: rgba(125, 125, 125, 0.1);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.67);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
    display: block;
    flex: 0 0 auto;
    grid-area: avatar;
  }

  h1 {
    grid-area: title;
  }

  h2 {
    grid-area: subtitle;
  }
</style>

<script>
  import md5 from 'blueimp-md5'
  import { parsePhoneNumberFromString } from 'libphonenumber-js'
  import { mapState } from 'vuex'

  export default {
    filters: {
      phoneNumber (value) {
        const v = parsePhoneNumberFromString(value || '', 'US')

        if (v != null && v.country === 'US') {
          return v.formatNational()
        } else if (v != null) {
          return v.formatInternational()
        } else {
          return null
        }
      }
    },

    props: {
      userId: {
        type: [String, Number],
        default: null
      }
    },

    data: () => ({
      user: {}
    }),

    async fetch () {
      if (this.userId != null) {
        this.user = await this.$hal()
          .get(`/accounts/users/${this.userId}`)
          .jsonApi()
          .flatten()
      }
    },

    computed: {
      ...mapState('context', ['site']),

      avatarExists () {
        return (this.user.email != null && this.user.email !== '')
      },

      avatarHash () {
        if (this.avatarExists) {
          return md5(this.user.email)
        } else {
          return md5('hosting@system76.com')
        }
      },

      avatarUrl () {
        if (this.avatarExists) {
          return `https://www.gravatar.com/avatar/${this.avatarHash}.jpg?s=48&d=identicon`
        } else {
          return `https://www.gravatar.com/avatar/${this.avatarHash}.jpg?s=48&d=identicon&f=y`
        }
      },

      fullName () {
        const res = [this.user.firstName, this.user.lastName]
          .filter((u) => (u != null))
          .join(' ')

        return (res === '') ? 'Unknown' : res
      },

      isBusiness () {
        return (this.user.affiliation === 'BUSINESS' && this.user.companyName != null)
      },

      joshuaUrl () {
        return `https://${this.site}.com/admin/service/customer/${this.userId}`
      },

      lcarsUrl () {
        return `https://admin.${this.site}.com/account/customers/${this.userId}`
      },

      subtitle () {
        if (this.isBusiness) {
          return this.fullName
        } else if (this.user.companyName != null) {
          return this.user.companyName
        } else {
          return null
        }
      },

      title () {
        if (this.isBusiness) {
          return this.user.companyName
        } else {
          return this.fullName
        }
      }
    }
  }
</script>
