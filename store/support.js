import camelCase from 'lodash/camelCase'
import pick from 'lodash/pick'

const BLOCKLIST_FIELDS = ['collaborator', 'problem', 'sharedWith', 'tags']

export const state = () => ({
  fields: [],

  requester: {
    id: null,
    email: null,
    name: null,
    externalId: null
  }
})

export const getters = {
  getField: (state) => (name) => {
    return state.fields.find((f) => {
      return (f.name === name || camelCase(f.label) === name)
    })
  },

  getFieldValue: (state, getters) => (name) => {
    const field = getters.getField(name)
    return (field != null) ? field.value : null
  }
}

export const mutations = {
  setFields (state, fields) {
    state.fields = fields.map((f) => pick(f, ['label', 'name', 'value']))
  },

  setRequester (state, requester) {
    Object.entries(requester).forEach(([k, v]) => {
      state.requester[k] = v
    })
  }
}

export const actions = {
  async fetchFields ({ commit }) {
    const raw = await this.$zendesk.get('ticketFields')
    const cleaned = raw.ticketFields
      .filter((f) => (f.label != null && f.name != null))
      .filter((f) => !BLOCKLIST_FIELDS.includes(f.name))

    const names = cleaned
      .map((f) => f.name)
      .map((f) => `ticket.customField:${f}`)
    const values = await this.$zendesk.get(names)

    Object.entries(values).forEach(([k, v]) => {
      if (k !== 'errors') {
        const key = k.replace('ticket.customField:', '')
        const cleanedValue = cleaned.find((c) => (c.name === key))

        if (cleanedValue != null) {
          cleanedValue.value = v
        }
      }
    })

    commit('setFields', cleaned)
  },

  async fetchRequester ({ commit }) {
    const req = await this.$zendesk.get('ticket.requester')
    commit('setRequester', req['ticket.requester'])
  }
}
