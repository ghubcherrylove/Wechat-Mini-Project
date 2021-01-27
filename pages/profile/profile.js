let app = getApp()
Page({
  data:{
    userInfo: {},
    genderMap: {'Male': '男', 'Female': '女'}
  },
  onLoad(options) {
    // https://www.aicloud.site/sell/user/1 获取用户接口
    console.log('--options--')
    console.log(options)
    app.getUserInfo(userInfo => {
      userInfo.gender = userInfo.gender === 1 ? 'Male' : 'Female'
      this.setData({
        userInfo: userInfo
      })
    })
  }
})