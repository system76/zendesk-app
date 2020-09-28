import debounce from 'lodash/debounce'

const client = ZAFClient.init()

const resize = debounce(() => {
  const height = (document.body.clientHeight > 200)
    ? document.body.clientHeight
    : 200

  client.invoke('resize', {
    height: `${height}px`,
    width: '100%'
  })
}, 100)

export default (context, inject) => {
  context.app.router.afterEach(resize)

  inject('zendesk', client)
}
