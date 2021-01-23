
let UserService = require('../../services/UserService')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.realName) {
      wx.showToast({
        icon: 'none',
        title: '请填写姓名',
      })
    }
    if (!e.detail.value.idCard) {
      wx.showToast({
        icon: 'none',
        title: '请填写身份证号',
      })
    }
    UserService.verify(e.detail.value).then(res => {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})