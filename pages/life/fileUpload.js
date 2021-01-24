// pages/life/fileUpload.js
let UserService = require('../../services/UserService')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    selectFile: [],
    uplaodFile: []
  },
  // 提交图片
  submit() {
    var that = this;
    var url = 'user/life/fileUpload'; //后台接口地址
    var filePath = that.data.filesUrl[0];
    var formData = { //表单数据
      'files': that.data.files,
      'test': 'hah'
    };
    console.log('filePath');
    console.log(filePath)
    app.uploadFile(url, filePath, formData).then((res) => { //上图图片并保存表单
        console.log('上图图片并保存表单')
        console.log(res)
        if (res.code === 0) { // 成功
          wx.showToast({
            title: '添加成功'
          });
          // 回到我的tar页
          wx.switchTab({
            url: '/pages/settings/settings',
          })
        }
      }).catch((err) => {
        wx.showToast({
          title: '保存失败'
        })
      })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log('--返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片--')
        console.log(res)
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    var that = this;
    return new Promise((resolve, reject) => {
      console.log('filesssssss');
      console.log(files)
      const tempFilePaths = files.tempFilePaths;
      that.setData({
        filesUrl: tempFilePaths
      })
      var object = {};
      object['urls'] = tempFilePaths;
      resolve(object);
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
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