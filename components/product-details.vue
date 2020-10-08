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

    <b-collapse
      v-else
      :open.sync="isOpen"
    >
      <div
        slot="trigger"
        slot-scope="props"
        :class="$style.head"
      >
        <img
          :src="thumbnailUrl"
          :alt="product.name"
        >

        <h1 class="title is-4 my-0">
          {{ product.name }}

          <template v-if="product.count > 1">
            x {{ product.count }}
          </template>
        </h1>
        <h2 class="subtitle is-5 my-0">
          {{ product.model }}
        </h2>

        <font-awesome-icon
          :icon="props.open ? 'angle-up' : 'angle-down'"
        />
      </div>

      <b-tabs>
        <b-tab-item label="Technical">
          <ul :class="$style.list">
            <li>
              <span>Base System Price</span>
              <span class="price">{{ currency(product.basePrice) }}</span>
            </li>

            <li
              v-for="o in product.options"
              :key="o.$key"
            >
              <!-- eslint-disable vue/no-v-html -->
              <span v-html="markdown(o.description)" />
              <!-- eslint-enable vue/no-v-html -->
              <span
                v-if="o.priceChange !== '0.00'"
                class="price"
              >
                {{ currency(o.priceChange) }}
              </span>
            </li>

            <li>
              <span>Subtotal</span>
              <span class="price">{{ currency(product.priceAsConfigured) }}</span>
            </li>
          </ul>
        </b-tab-item>

        <b-tab-item label="Advertised">
          <ul :class="$style.list">
            <li>
              <span>Base System Price</span>
              <span class="price">{{ currency(product.basePrice) }}</span>
            </li>

            <li
              v-for="o in product.options"
              :key="o.$key"
            >
              <!-- eslint-disable vue/no-v-html -->
              <span v-html="markdown(o.name)" />
              <!-- eslint-enable vue/no-v-html -->
              <span
                v-if="o.priceChange !== '0.00'"
                class="price"
              >
                {{ currency(o.priceChange) }}
              </span>
            </li>

            <li>
              <span>Subtotal</span>
              <span class="price">{{ currency(product.priceAsConfigured) }}</span>
            </li>
          </ul>
        </b-tab-item>
      </b-tabs>
    </b-collapse>
  </div>
</template>

<style module>
  .container {
    position: relative;
  }

  .head {
    align-items: center;
    align-content: center;
    display: grid;
    grid-gap: 1ch 2ch;
    grid-template-areas:
      "image title icon"
      "image subtitle icon";
    grid-template-columns: auto 1fr;
  }

  .head img {
    grid-area: image;
  }

  .head h1 {
    align-self: flex-end;
    grid-area: title;
  }

  .head h2 {
    align-self: flex-start;
    grid-area: subtitle;
  }

  .head svg {
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

  .list .price {
    white-space: nowrap;
    word-break: keep;
    margin-left: 1rem;
  }
</style>

<script>
  import { mapState } from 'vuex'

  import { inline as markdown } from '@system76/markdown'

  import { currency } from '~/utility'

  export default {
    props: {
      open: {
        type: Boolean,
        default: false
      },

      productId: {
        type: [String, Number],
        required: true
      }
    },

    data () {
      return {
        isOpen: this.open
      }
    },

    async fetch () {
      this.product = await this.$hal()
        .get(`/fulfillment/products/${this.productId}`)
        .include('options')
        .jsonApi()
        .flatten()
    },

    computed: {
      ...mapState('context', ['site']),

      thumbnailUrl () {
        return `https://assets.${this.site}.com/products/${this.product.model}/thumb.png?width=64&height=64`
      }
    },

    methods: {
      currency,
      markdown
    }
  }
</script>
