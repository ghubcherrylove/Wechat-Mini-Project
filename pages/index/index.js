let app = getApp()
let util = require('../../utils/util')
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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    let that = this;
    try {
      let value = wx.getStorageSync('userInfo')
      if (value) {
        that.getUserList()
      } else {
        that.login(res => {
          if (res.statusCode !== 200) { // 登录失败
            wx.showToast({
              title: '登录失败',
            })
          } else {
            wx.showToast({
              title: '登录成功',
            })
            that.setData({isHide: false})
            // 获取用户列表
            that.getUserList()
          }
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  login(callback = () => {}) {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true, // 非必填, 默认为true
            success: function (userinfo) {
              // console.log('用户信息')
              // console.log(userinfo)
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  // console.log("用户的code:" + res.code);
                  let code = res.code;
                  // 可以传给后台，再经过解析获取用户的 openid
                  ajax({
                    url: 'api/auth/login',
                    data: {
                      code,
                      userName: "",
                      password: "",
                      authType: 1,
                      rawData: userinfo.rawData, // 用户非敏感信息
                      signature: userinfo.signature, // 签名
                      encryptedData: userinfo.encryptedData, // 用户敏感信息
                      iv: userinfo.iv, // 解密算法的向量
                    },
                    method: 'POST',
                    success: res => {
                      console.log('登录成功，后端并返回openid给前端')
                      console.log(res)
                      // wx.setStorage({data: res.data.openid, key: 'openid'})
                      callback(res)
                    },
                    fail: function (fail) {
                      console.log('登录失败')
                      console.log(fail)
                      callback({statusCode: 300})
                    },
                    complete: _ => {
                      wx.stopPullDownRefresh()
                    }
                  })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({isHide: true});
        }
      }
    });
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
  getUserList() {
    let that = this;
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
      fail: function (res) {
        console.log('获取用户列表失败');
        that.setData({empty: true})
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
      console.log('-----------userInfo---------')
      console.log(userInfo)
      app.globalData.userInfo = userInfo;
      this.setData({isHide: false,userInfo: res.detail.userInfo});
      wx.setStorage({data: userInfo, key: 'userInfo'})
      this.login(res => {
        // 获取用户列表
        this.getUserList()
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