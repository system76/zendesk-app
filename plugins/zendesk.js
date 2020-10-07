import debounce from 'lodash/debounce'

export default (context, inject) => {
  const client = window.ZAFClient.init()

  if (client === false) {
    return context.error(400, 'Unable to connect with Zendesk')
  }

  client.on('reload', () => window.location.reload())

  client.modal = (url, opts = {}) => {
    const [, host,, query] = window.location.href.match(/^(https?:\/\/[a-zA-Z0-9.:-]+)(\/.*)(\?.*)$/)

    return new Promise((resolve, reject) => {
      client.invoke('instances.create', {
        location: 'modal',
        url: host + url + query,
        ...opts
      })
        .then((ctx) => client.instance(ctx['instances.create'][0].instanceGuid))
        .then((cli) => cli.on('modal.close', resolve))
        .catch(reject)
    })
  }

  client.resize = debounce(() => {
    // Because this is debounced, we can redirect or do something weird before it
    // runs, causing an undefined error. So we just ignore failed resize events
    try {
      const height = (document.body.clientHeight > 200)
        ? document.body.clientHeight
        : 200

      client.invoke('resize', {
        height: `${height}px`,
        width: '100%'
      })
    } catch (e) {}
  }, 10)

  client.remote = async (location) => {
    const instanceData = await client.get('instances')
    const matchingLocation = Object.values(instanceData.instances).find((i) => {
      return (i.location === location)
    })

    if (matchingLocation == null) {
      return null
    } else {
      return client.instance(matchingLocation.instanceGuid)
    }
  }

  inject('zendesk', client)

  context.app.router.afterEach(client.resize)
  context.store.dispatch('context/fetch')
}
