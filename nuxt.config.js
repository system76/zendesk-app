export default {
  ssr: false,
  target: 'static',

  components: true,
  telemetry: false,

  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js' }
    ]
  },

  css: [
    '~/assets/styles/bulma.scss'
  ],

  generate: {
    fallback: 'index.html'
  },

  modules: [
    '@nuxtjs/style-resources'
  ],

  plugins: [
    '~/plugins/buefy',
    '~/plugins/zendesk'
  ],

  server: {
    host: '0.0.0.0',
    port: 4567
  },

  serverMiddleware: [
    '~/server-middleware/zat'
  ],

  styleResources: {
    scss: [
      'assets/styles/variables.scss'
    ]
  }
}
