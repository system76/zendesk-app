export const state = () => ({
  site: null,
  guid: null,

  product: null,
  location: null
})

export const mutations = {
  set (state, obj) {
    Object.entries(obj).forEach(([k, v]) => {
      state[k] = v
    })
  }
}

export const actions = {
  async fetch ({ commit }) {
    const context = await this.$zendesk.context()

    commit('set', {
      site: context.account.subdomain.replace('d3v-', ''),
      guid: context.instanceGuid,

      product: context.product,
      location: context.location
    })
  }
}
