// pages/exchange/exchange.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData : 0,
    interactionList: [{
      nickName: '',
      message: '',
      doctorOpenid: '',
      userOpenid: '',
      date: '',
      avatarUrl: ''
    }]
  },

  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  stopTouchMove: function() {
    return false;
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;
    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorage({
      key: 'userInfo',
    })
    let opendId = userInfo.opendId;

    
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
    let i = 0;
    let userInfo = wx.getStorageSync("userInfo");
    let openId = userInfo.openId;
    let authnizatin =  wx.getStorageSync("Authorization");
    request.get('/api/chat/'+openId, {}, {Authorization:authnizatin}).then(res => {
      console.log(res);
      res.data.data.forEach((item) => {
        console.log(item.openId)
        this.setData({
          ['interactionList['+i+']'] : {
            doctorOpenid: item.openId,
            userOpenid: item.openId,
            doctorName: item.nickName,
            message: item.openId,
            date: item.openId,
            avatarUrl: item.avatarUrl
          }
        })
        i++;
      })
    })
  },
  userButtonTap(e) {
    console.log('user button tap', e)
    wx.navigateTo({
      url: '/pages/consultation/consultation?thisUserOpenid=' + e.currentTarget.dataset.data.userOpenid+'&otherUserOpenid=' + e.currentTarget.dataset.data.doctorOpenid+'&doctorName='+e.currentTarget.dataset.data.doctorName,
    })
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