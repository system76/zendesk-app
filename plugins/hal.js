import { Client } from '@system76/js-api'

export default async function (ctx, inject) {
  const metadata = await ctx.$zendesk.metadata()

  const client = () => new Client({
    baseUrl: metadata.settings.halUrl,
    token: `Token ${metadata.settings.token}`
  })

  inject('hal', () => client())
}
