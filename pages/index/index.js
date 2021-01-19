let app = getApp()
let util = require('../../utils/util')
let ajax = require('../../network/ajax')

let refreshing = false, refreshed = false, loadingMore = false, loadedEnd = false

Page({
  data: {
    timeline: [],
    userInfo: {},
    isLogin: app.globalData.isLogin || false
  },
  onShow() {
    console.log('index onShow app');
    console.log(app)
    app.getUserInfo(userInfo => {
      this.setData({
        userInfo: userInfo
      })
    })
  },
  onLoad() {
    // console.log('index app');
    // console.log(app)
    // app.getUserInfo(userInfo => {
    //   this.setData({
    //     userInfo: userInfo
    //   })
    // })
  },
  onReady() {
    this.getTimeline()  
  },
  onPullDownRefresh() {
    if(refreshing) return false

    refreshing = true
    ajax({
        url: 'refresh_timeline.json',
        success: res => {
          if(refreshed) {
            wx.showToast({
              title: '没有刷出新消息哦！'
            })
          } else {
            let timeline = this.formatTimeline(res.data)
            this.setData({
              timeline: [...timeline, ...this.data.timeline]
            })
          }
        },
        complete: _ => {
          refreshing = false
          refreshed = true
          wx.stopPullDownRefresh()
        }
    })
  },
  scrollToLower() {
    if(loadingMore || loadedEnd) return false

    loadingMore = true
    ajax({
        url: 'more_timeline.json',
        success: res => {
          let timeline = this.formatTimeline(res.data)
          this.setData({
            timeline: [...this.data.timeline, ...timeline]
          })
        },
        complete: _ => {
           loadingMore = false
           loadedEnd = true 
        }
    })
  },
  getTimeline() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    ajax({
        url: 'timeline.json',
        success: res => {
          let timeline = this.formatTimeline(res.data)
          this.setData({
            timeline: timeline
          })
        },
        complete: _ => {
          wx.hideToast()
        }
    })
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(res.detail.userInfo);
      let userInfo = res.detail.userInfo;
      app.globalData.userInfo = userInfo;
      this.setData({isLogin: true, userInfo: res.detail.userInfo});
      wx.setStorage({
        data: userInfo,
        key: 'userInfo',
      })
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      //       that.setData({
      //         isHide: false
      //       });
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
  },
  formatTimeline(items) {
    items.forEach(item => {
      item.avatar = util.getAvatarUrl(item.avatar)
      item.time = util.timeFormat(item.created_at)
      return item
    })
    return items
  },
  previewImage(event) {
    wx.previewImage({
      current: '', 
      urls: [event.target.dataset.originalPic]
    })
  } 
})
