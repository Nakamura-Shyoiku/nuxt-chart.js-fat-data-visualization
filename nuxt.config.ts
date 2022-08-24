module.exports = {
    head: {
      title: 'Line Chart App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', content: 'This is Line Chart Sample Nuxt App.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
      ]
    },
    router: {
      linkActiveClass: 'selected'
    },
    modules: ['@nuxt/content']
  }
  