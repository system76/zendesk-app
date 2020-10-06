import debounce from 'lodash/debounce'

export default (context, inject) => {
  const client = window.ZAFClient.init()

  if (client === false) {
    return context.error(400, 'Unable to connect with Zendesk')
  }

  const resize = debounce(() => {
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
  }, 100)

  context.app.router.afterEach(resize)

  client.modal = (url, opts) => {
    const [, host,, query] = window.location.href.match(/^(https?:\/\/[a-zA-Z0-9:]+)(\/.*)(\?.*)$/)

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

  inject('zendesk', client)
}
