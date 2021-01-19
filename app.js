let ajax = require('./network/ajax')

App({
  onLaunch() {
   //TODO
   let that = this;
   wx.getSetting({
     success: function(res) {
      console.log('--------res------')
      console.log(res)
      if (res.authSetting['scope.userInfo']) {// 授权用户
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
          success: function(res) {
            console.log('在用户已经授权的情况下获取用户信息')
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            that.globalData.isLogin = true;
            that.globalData.userInfo = res.userInfo;
            wx.login({
              success: _ => {
                console.log('login请求code')
                console.log(_)
                // code: "061MSi0w3ktoGV26Ph1w3rXmPv0MSi0U"
                // errMsg: "login:ok"
                // 登录接口 https://aicloud.thingsmatrix.co/sell/user/login
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
      } else { // 未授权用户
        that.globalData.isLogin = false;
        console.log('未授权用户, 跳转到login页面 点击授权按钮')
        // wx.navigateTo({
        //   url: '../../pages/login/login',
        // })
      }
     }
   })
  },
  getUserInfo(cb) {
    console.log('app')
    console.log(this.globalData.userInfo)
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: _ => {
          wx.getUserInfo({
            success: res => {
              console.log('app res')
              console.log(res)
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false
  }
})
