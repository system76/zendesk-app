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
    '~/assets/styles/main.css'
  ],

  generate: {
    dir: 'dist/assets'
  },

  plugins: [
    '~/plugins/zendesk.js'
  ]
}
