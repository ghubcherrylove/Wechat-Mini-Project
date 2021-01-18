let app = getApp()
Page({
  data:{
    userInfo: {}
  },
  onLoad() {
    console.log('userInfo1')
    app.getUserInfo(userInfo => {
      console.log('userInfo')
      console.log(userInfo)
      this.setData({
        userInfo: userInfo
      })
    })
  },
  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route + '?id=1'
    })
  },
  bindGetUserInfo (e) {
    console.log('--e--')
    console.log(e)
    this.userInfo = e.detail.userInfo;
  }
})