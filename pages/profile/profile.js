let app = getApp()
Page({
  data:{
    userInfo: {},
    genderMap: {'Male': '男', 'Female': '女'}
  },
  onLoad(options) {
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