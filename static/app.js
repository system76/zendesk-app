(function () {
  window.ZendeskApps.System76 = window.ZendeskApps.defineApp(null)
    .reopenClass({
      location: {
        support: {
          ticket_sidebar: {
            url: 'assets/support/ticket_sidebar'
          }
        }
      },
      singleInstall: false,
      signedUrls: false
    })
    .reopen({
      appName: 'System76',
      appVersion: '1.0',
      assetUrlPrefix: 'http://localhost:4567/',
      logoAssetHash: {
        support: 'logo-small.png'
      },
      appClassName: 'app-0',
      author: {
        name: 'System76',
        email: 'hosting@system76.com'
      },
      frameworkVersion: '2.0'
    })
    .install({
      id: 0,
      app_id: 0,
      app_name: 'System76',
      enabled: true,
      requirements: null,
      collapsible: true,
      settings: {
        title: 'System76'
      },
      plan: {
        name: null
      }
    })
}())

window.ZendeskApps.trigger && window.ZendeskApps.trigger('ready')
