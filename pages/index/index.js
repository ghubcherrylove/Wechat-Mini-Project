let app = getApp()
let util = require('../../utils/util')
let UserService = require('../../services/UserService')
let {Dict} = require('../../utils/consts')

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
      // that.getUserList(this.data.param)
    } else {
      // this.setData({isHide: true})
    }
  },
  onShow() {
    // this.setData({isHide: false})
    this.getUserList(this.data.param)
  },
  onReady() {
    // this.getUserList()
  },
  // 跳转到详情页
  navToPage(event) {
    let openid = event.currentTarget.dataset.openid;
    // 跳转到详情页
    wx.navigateTo({
      url: '../details/details' + '?openid=' + openid
    })
  },
  scrollToLower() {
    if (loadingMore || loadedEnd) return false
    loadingMore = true;
    this.getUserList({page: ++this.data.param.page, size: this.data.param.size}, data => {
      let userlist = this.formatTimeline(data.content);
      if (userlist.length === 0) {
        wx.showToast({
          title: '没有数据了',
          icon: 'error'
        })
      }
      this.setData({
        userlist: [...this.data.userlist, ...userlist]
      })
    }, data => {
      loadingMore = false
      loadedEnd = false
    })
  },
  async getUserList(query = {page:0, size: 10}, callback, complete) {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    // 第一个data参数 第二个是query查询参数 page:0 size: 10
    let {code = 1, data = {}, msg = ''} = await UserService.list(this.data.param);
    if (code === 0) { // 成功
      if (callback) {
        callback(data)
        complete(data)
      } else {
        let userlist = this.formatTimeline(data.content);
        this.setData({
          userlist: [...this.data.userlist, ...userlist]
        })
      }
    }

  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      let userInfo = res.detail.userInfo;
      app.doLogin(res => {
        if (res.code === 0) { // 成功
          console.log('登录成功')
          console.log(res)
          // this.setData({isHide: false})
          wx.setStorageSync("Authorization", res.data.module.token);
          wx.setStorageSync("userInfo", res.data.module.userInfo);
          this.getUserList(this.data.param)
        }
        // this.getUserList(this.data.param)
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
      item.salary = util.formatSalary(item.salary)
      item.birthDate = util.formatDateYear(item.birthDate)
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