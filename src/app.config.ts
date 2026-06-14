export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/vendor/index',
    'pages/patrol/index',
    'pages/stats/index',
    'pages/notice/index',
    'pages/signup/index',
    'pages/license/index',
    'pages/payment/index',
    'pages/inspection/index',
    'pages/refund/index',
    'pages/vendor-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165dff',
    navigationBarTitleText: '集市管理',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f6f7'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#165dff',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '摊位地图'
      },
      {
        pagePath: 'pages/vendor/index',
        text: '摊主服务'
      },
      {
        pagePath: 'pages/patrol/index',
        text: '巡场管理'
      },
      {
        pagePath: 'pages/stats/index',
        text: '经营中心'
      }
    ]
  }
})
