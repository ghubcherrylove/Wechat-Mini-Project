let app = getApp()
let util = require('../../utils/util')
let UserService = require('../../services/UserService')
let {
  Dict
} = require('../../utils/consts')
let ajax = require('../../network/ajax')

let refreshing = false,
  refreshed = false,
  loadingMore = false,
  loadedEnd = false

Page({
  data: {
    userlist: [],
    userInfo: {},
    isHide: false,
    empty: false,
    param: {
      page: 0,
      size: 10
    },
    // new Date(item.birthDate).getFullYear() + new Date(item.birthDate).getMonth()
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    let that = this;
    if (app.globalData.userInfo) {
      that.getUserList(this.param)
    } else {
      this.setData({isHide: true})
      // app.doLogin(res => {
      //   that.getUserList()
      // });
    }
  },
  onReady() {
    // this.getUserList()
  },
  onPullDownRefresh() {
    if (refreshing) return false
    refreshing = true
    ajax({
      url: 'refresh_timeline.json',
      success: res => {
        if (refreshed) {
          wx.showToast({
            title: '没有刷出新消息哦！'
          })
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
    if (loadingMore || loadedEnd) return false
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
  getUserList(param = {page:0, size: 10}) {
    let that = this;
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    UserService.list(param).then(res => {
      // if (res.success) {
      //   let userlist = this.formatTimeline(res.data.list)
      //   this.setData({userlist: userlist})
      // }
      let userlist = this.formatTimeline(res.content)
      this.setData({userlist: userlist})
    })
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      let userInfo = res.detail.userInfo;
      this.setData({isHide: false})
      app.doLogin(res => {
        this.getUserList()
      });
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
      item.birthDate = util.formatDateYear(item.birthDate)
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