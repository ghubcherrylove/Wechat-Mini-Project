let ajax = require('../../network/ajax')
let util = require('../../utils/util')
let app = getApp()
Page({
  data:{
    userInfo: {}
  },
  onLoad() {
    app.getUserInfo(userInfo => {
      this.setData({
        userInfo: userInfo
      })
    })
  },
  navToPage(event) {
    let route = event.currentTarget.dataset.route;
    // 获取openid
    let userStorageInfo = wx.getStorageSync("userInfo");
    wx.navigateTo({
      url: route + '?openId=' + userStorageInfo.openId
    })
  },
  bindGetUserInfo (e) {
    let userInfo = e.detail.userInfo
    this.setData({userInfo: userInfo})
    wx.login({
      success: _ => {
        console.log('login请求code')
        console.log(_)
        ajax({
          url: 'sell/user/login',
          data: {
            code: _.code,
            userInfo: userInfo
          },
          method: 'POST',
          success: res => {
            console.log('登录成功，后端并返回openid给前端')
            console.log(res)
          },
          complete: _ => {
            wx.stopPullDownRefresh()
          }
        })
      }
    })
  }
})