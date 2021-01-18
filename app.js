App({
  onLaunch() {
   //TODO
   console.log('app onLaunch')
  },
  getUserInfo(cb) {
    console.log('app')
    console.log(this.globalData.userInfo)
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getUserInfo({
      success: function(res) {
        console.log('--res--');
        console.log(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: _ => {
          console.log('--------')
          console.log(_)
          // code: "061MSi0w3ktoGV26Ph1w3rXmPv0MSi0U"
          // errMsg: "login:ok"
          wx.getUserInfo({
            success: res => {
              console.log('app res')
              console.log(res)
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(this.globalData.userInfo)
            },
            fail: (error) => {
              console.log('--error--')
              console.log(error)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
