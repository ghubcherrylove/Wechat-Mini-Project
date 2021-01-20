let app = getApp()
let util = require('../../utils/util')
let {Dict} = require('../../utils/consts')
let ajax = require('../../network/ajax')

let refreshing = false, refreshed = false, loadingMore = false, loadedEnd = false

Page({
  data: {
    userlist: [],
    userInfo: {},
    educationMap: [
      {key: "1", name: "小学"},
      {key: "2", name: "初中"},
      {key: "3", name: "高中"},
      {key: "4", name: "大专"},
      {key: "5", name: "本科"},
      {key: "6", name: "硕士"},
      {key: "7", name: "博士"},
      {key: "8", name: "博士后"}
    ],
    isLogin: app.globalData.isLogin || false
  },
  formatEducation(list = []) {
    
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
    this.getUserList()  
  },
  onPullDownRefresh() {
    if(refreshing) return false
    refreshing = true
    ajax({
        url: 'refresh_timeline.json',
        success: res => {
          if(refreshed) {
            wx.showToast({title: '没有刷出新消息哦！'})
          } else {
            let userlist = this.formatTimeline(res.data.list)
            this.setData({
              userlist: [...userlist, ...this.data.userlist]
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
          let userlist = this.formatTimeline(res.data.list)
          this.setData({
            userlist: [...this.data.userlist, ...userlist]
          })
        },
        complete: _ => {
           loadingMore = false
           loadedEnd = true 
        }
    })
  },
  getUserList() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    ajax({
        url: 'sell/user/list',
        success: res => {
          let userlist = this.formatTimeline(res.data.list)
          this.setData({userlist: userlist})
        },
        fail: function(res) {
          console.log('获取用户列表失败');
          console.log(res)
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
      let userInfo = res.detail.userInfo;
      app.globalData.userInfo = userInfo;
      this.setData({isLogin: true, userInfo: res.detail.userInfo});
      wx.setStorage({
        data: userInfo,
        key: 'userInfo',
      })
      wx.login({
        success: _ => {
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
            fail: function (fail) {
              console.log('fail')
              console.log(fail)
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
  formatTimeline(items = []) {
    items.forEach(item => {
      // item.avatar = util.getAvatarUrl(item.avatar)
      item.time = util.formatDateTime(item.time)
      item.salary = util.formatSalary(item.salary)
      
      item.education = Dict.getText(item.education, Dict.store.EDUCATIONS)
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
