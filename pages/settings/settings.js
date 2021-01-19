let ajax = require('../../network/ajax')
let util = require('../../utils/util')
let app = getApp()
Page({
  data:{
    userInfo: {}
  },
  onShow() {
    console.log('settings onShow app');
    console.log(app)
    app.getUserInfo(userInfo => {
      console.log('userInfo')
      console.log(userInfo)
      this.setData({
        userInfo: userInfo
      })
    })
  },
  onLoad() {
    // console.log('settings app');
    // console.log(app)
    // app.getUserInfo(userInfo => {
    //   console.log('userInfo')
    //   console.log(userInfo)
    //   this.setData({
    //     userInfo: userInfo
    //   })
    // })
  },
  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route + '?id=1'
    })
  },
  bindGetUserInfo (e) {
    let userInfo = e.detail.userInfo
    this.setData({userInfo: userInfo})
    wx.login({
      success: _ => {
        console.log('login请求code')
        console.log(_)
        // code: "061MSi0w3ktoGV26Ph1w3rXmPv0MSi0U"
        // errMsg: "login:ok"
        // 登录接口 https://aicloud.thingsmatrix.co/sell/user/login
        ajax({
          url: 'sell/user/login',
          // query: {
          //   doce: _.code
          // },
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