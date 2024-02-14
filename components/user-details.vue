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

    <div v-else-if="user.id">
      <div :class="$style.head">
        <img
          :src="avatarUrl"
          :title="title"
          :alt="title"
          :class="$style.avatar"
        >
        <div :class="$style.details">
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

      <div :class="[$style.foot, 'mt-2']">
        <b-taglist :class="[$style.tags, 'mt-2 mb-0']">
          <b-tag v-if="isBusiness">
            Business
          </b-tag>
          <b-tag v-if="user.taxExempt">
            Tax Exempt
          </b-tag>
          <b-tag v-if="isRepeatCustomer">
            Repeat Customer
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

      <template v-if="joshuaTickets.length > 0">
        <hr class="my-4">

        <b-collapse :open.sync="showJoshuaTickets">
          <div
            slot="trigger"
            slot-scope="props"
            :class="$style.dropdown"
          >
            <h2 class="subtitle is-5 my-0">
              {{ joshuaTickets.length }} Joshua support
              <template v-if="joshuaTickets.length === 1">
                ticket
              </template>
              <template v-else>
                tickets
              </template>
            </h2>

            <font-awesome-icon
              :icon="props.open ? 'angle-up' : 'angle-down'"
            />
          </div>

          <ul :class="$style.list">
            <li
              v-for="ticket in joshuaTickets"
              :key="ticket.id"
            >
              <a
                :href="`https://${site}.com/admin/support/view/${ticket.id}`"
                target="_blank"
              >
                {{ ticket.subject }}
              </a>
              <span :class="$style.timestamp">{{ friendlyDate(ticket.lastActionTimestamp) }}</span>
            </li>
          </ul>
        </b-collapse>
      </template>
    </div>

    <div
      v-else
      :class="$style.inline"
    >
      <h1 class="title my-0 is-4">
        Unknown User
      </h1>
    </div>
  </div>
</template>

<script>
  import md5 from 'blueimp-md5'
  import { format, parseISO } from 'date-fns'
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
      },

      orderId: {
        type: [String, Number],
        default: null
      }
    },

    data: () => ({
      user: {},
      orders: [],
      joshuaTickets: [],
      showJoshuaTickets: false
    }),

    async fetch () {
      if (this.userId != null) {
        this.user = await this.$hal()
          .get(`/accounts/users/${this.userId}`)
          .jsonApi()
          .flatten()

        this.orders = await this.$hal()
          .get('/fulfillment/orders')
          .parameter('filter[user-id]', this.userId)
          .parameter('filter[status]', 'shipped_complete')
          .jsonApi()
          .flatten()

        this.joshuaTickets = (await this.$hal()
          .get('/support/tickets')
          .parameter('filter[user-id]', this.userId)
          .jsonApi()
          .flatten())
          .sort((a, b) => (parseISO(b.lastActionTimestamp) - parseISO(a.lastActionTimestamp)))
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
          .filter(u => (u != null))
          .join(' ')

        return (res === '') ? 'Unknown' : res
      },

      isBusiness () {
        return (this.user.affiliation === 'BUSINESS' && this.user.companyName != null)
      },

      isRepeatCustomer () {
        const size = this.orders.length
        const minOrders = this.orderId ? 1 : 2
        return size >= minOrders
      },

      joshuaUrl () {
        return `https://joshua.${this.site}.com/admin/service/customer/${this.userId}`
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
    },

    methods: {
      friendlyDate (date) {
        return format(parseISO(date), 'MMM d RRRR')
      }
    }
  }
</script>

<style module>
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

  .avatar {
    background-color: rgba(125, 125, 125, 0.1);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.67);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
    display: block;
    flex: 0 0 auto;
    grid-area: avatar;
  }

  .details {
    grid-area: details;
  }

  .dropdown {
    display: grid;
    grid-gap: 1ch 2ch;
    grid-template-areas: "text icon";
    grid-template-columns: 1fr auto;
  }

  .dropdown h2 {
    grid-area: text;
  }

  .dropdown svg {
    grid-area: icon;
    margin: 0 16px;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 1rem 0 0;
  }

  .list li {
    align-content: center;
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0.6rem 1rem;
  }

  .list li:nth-child(even) {
    background-color: #fafafa;
    position: relative;
  }

  .list .timestamp {
    white-space: nowrap;
    word-break: keep;
    margin-left: 1rem;
  }
</style>
