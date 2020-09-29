import debounce from 'lodash/debounce'

const client = window.ZAFClient.init()

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

export default (context, inject) => {
  context.app.router.afterEach(resize)

  inject('zendesk', client)
}
