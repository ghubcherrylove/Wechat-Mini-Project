let app = getApp()
let util = require('../../utils/util')
let UserService = require('../../services/UserService')
let {Dict} = require('../../utils/consts')
let ajax = require('../../network/ajax')

let refreshing = false,
  refreshed = false,
  loadingMore = false,
  loadedEnd = false

Page({
  data: {
    userlist: [],
    userInfo: {},
    EDUCATIONS: Dict.store.EDUCATIONS,
    BUY_HOUSES: Dict.store.BUY_HOUSES,
    BUY_CARS: Dict.store.BUY_CARS,
    MARRIEDS: Dict.store.MARRIEDS,
    isHide: false,
    empty: false,
    param: {
      page: 0,
      size: 10
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    let that = this;
    if (app.globalData.userInfo) {
      that.getUserList(this.data.param)
    } else {
      this.setData({isHide: true})
    }
  },
  onReady() {
    // this.getUserList()
  },
  scrollToLower() {
    if (loadingMore || loadedEnd) return false
    loadingMore = true;
    let that = this;
    this.getUserList({page: this.data.param.page++, size: this.data.param.size}, content => {
      let userlist = that.formatTimeline(content)
      this.setData({
        userlist: [...this.data.userlist, ...userlist]
      })
    })
    // this.getUserList({page: this.data.param.page++, size: this.data.param.size}).then(res => {
    //   if (refreshed) {
    //     wx.showToast({
    //       title: '没有刷出新消息哦！'
    //     })
    //   } else {
    //     let userlist = this.formatTimeline(res.content)
    //     this.setData({
    //       userlist: [...this.data.userlist, ...userlist]
    //     })
    //   }
    // })
  },
  async getUserList(query = {page:0, size: 10}, callback) {
    let that = this;
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    // UserService.list(this.data.param).then(data => {
    //   let userlist = this.formatTimeline(res.content)
    //   this.setData({userlist: userlist})
    //   if (callback) {
    //     callback(res);
    //   }
    // })
    // 第一个data参数 第二个是query查询参数 page:0 size: 10
    let {content = []} = await UserService.list(this.data.param);
    if (callback) {
      callback(content)
    } else {
      this.setData({userlist: content})
    }
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      let userInfo = res.detail.userInfo;
      this.setData({isHide: false})
      app.doLogin(res => {
        if (res.success) {
          wx.setStorageSync("Authorization", res.module.token);
          wx.setStorageSync("userInfo", res.module.userInfo);
          this.getUserList(this.data.param)
        }
        this.getUserList(this.data.param)
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
      item.time = util.formatDateTime(item.time)
      item.salary = util.formatSalary(item.salary)
      item.birthDate = util.formatDateYear(item.birthDate)
      // item.education = Dict.getText(item.education, Dict.store.EDUCATIONS)
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