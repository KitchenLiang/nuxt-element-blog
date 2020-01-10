
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no,viewport-fit=cover' },//禁止用户缩放
      { name: 'X-UA-Compatible', content: 'ie=edge,chrome=1' },//优先使用 IE 最新版本和 Chrome
      { name: 'Cache-Control', content: 'no-siteapp' },//转码申明：用百度打开网页可能会对其进行转码（比如贴广告），避免转码
      { name: 'Cache-Control', content: 'no-transform' },//不得对资源进行转换或转变
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'renderer', content:'webkit'},//浏览器内核控制
      { name: 'robots', content:'index,follow'},//搜索引擎索引方式
      { name: 'googlebot', content:'index,follow'},//搜索谷歌引擎索引方式
      { name: 'google', content:'notranslate'},//谷歌翻译
    ],
    link: [
      {  hid: 'icon',rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script:[
      // 加入百度统计js，使用时自行添加为自己的
      {src:'https://hm.baidu.com/hm.js?3fe14007f4e50044632c218e1f0d719c'},
      {src:'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'},
      {src:'https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js'},
      {src:'https://cdn.bootcss.com/tocbot/4.8.1/tocbot.min.js'},
      {src:'https://cdn.bootcss.com/highlight.js/9.15.10/highlight.min.js'},
      {src:'https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.js'},
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading:'./components/Loading',
  router:{
    middleware:'global',
    scrollBehavior(to,from,savedPosition){
      return {
        x:0,
        y:0
      }
    }
  },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    './assets/scss/global.scss',
  ],
  styleResources:{
    scss:['./assets/scss/variable.scss']
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/axios',
    {src:'@/plugins/element-ui',ssr:true},
    {src:'@/plugins/moment',ssr:true},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  axios:{
    proxy:true
  },
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios',{anotherOption:true}],
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  // 改为自己的地址
  proxy:{
    '/api':{
      target:'http://localhost:8090/',
      pathRewrite:{
        '^/api':'/'
      }
    },
  },
  render:{
    resourceHints:false,
  },
  env:{
    localurl:'http://localhost:8090/',
    baseUrl:'/api',
    Authorization:{'API-Authorization':'123456'},
  }
}
