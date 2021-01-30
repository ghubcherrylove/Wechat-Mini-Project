let UserService = require('../../services/UserService')
let app = getApp();

Page({
  data: {
    canIUse: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log("用户授权了");
    //     } else {
    //       //用户没有授权
    //       console.log("用户没有授权");
    //     }
    //   }
    // });
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      // console.log("用户的信息如下：");
      // console.log(res.detail.userInfo);
      // let userInfo =  res.detail.userInfo;
      // wx.setStorage({
      //   data: userInfo,
      //   key: 'userInfo',
      // })
      app.doLogin(res => {
        console.log('----登录成功，跳转到index首页---------')
        console.log(res)
        if (res.code === 0) {// 登录成功，跳转到index首页
          let openid = res.data.module.openId
          UserService.getUserInfoByOpenid(openid).then(res => {
            // 获取用户信息成功
            console.log('获取用户信息成功')
            if (res.code === 0) {
              if (!res.data.userInfo) {
                // 跳到注册信息页面
                wx.navigateTo({
                  url: '../basicInfo/basicInfo',
                })
              } else {
                // 跳到index首页
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
          // wx.switchTab({
          //   url: '../../pages/index/index',
          // })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})