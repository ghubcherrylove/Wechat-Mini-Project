var url = 'wss://www.aicloud.site/webSocket/';
var frameBuffer_Data, session, SocketTask;
let socketOpen = false;

// 心跳对象
let heartCheck = {
  timeout: 10000, 
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
   clearTimeout(this.timeoutObj);
   clearTimeout(this.serverTimeoutObj);
   return this;
  },
  start: function () {
   this.timeoutObj = setTimeout(()=> {
    console.log("发送ping");
    wx.sendSocketMessage({
     data:"ping",
     success() {
      console.log("发送ping成功");
     }
    });
    // this.serverTimeoutObj = setTimeout(() =>{
    //  wx.closeSocket(); 
    // }, this.timeout);
   }, this.timeout);
  }
 };

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '', // 输入框
    outValue: '', // 回显的值
    thisUserOpenid: '', // 当前登录用户的openid
    otherUserOpenid: '', // 对方的openid
    lockReconnect: false,
    limit: 1,
    timer: null
  },
  // 关闭websocket
  closeWebSocket() {
    console.log('准备执行关闭websocket')
    SocketTask.close({
      success: function (res) {
        console.log('关闭 websocket连接 成功')
        socketOpen = false;
      }
    })
  },
  linkSocket() {
    let that = this;
    let auth = wx.getStorageSync("Authorization");
    wx.connectSocket({
      url: url + this.data.thisUserOpenid + "?" + "Authorization=" + auth,
      success() {
        console.log('连接成功')
        that.initEventHandle()
      }
    })
  },
  // 连接websocket
  connectWebSocket: function () {
    let auth = wx.getStorageSync("Authorization");
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url + this.data.thisUserOpenid + "?" + "Authorization=" + auth,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        socketOpen = true;
        console.log('WebSocket连接成功：', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },
  getUserInput: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  submitTo() {
    if (!this.data.inputVal) {
      wx.showToast({
        title: '不能发送空内容',
        icon: 'none'
      })
      return
    }
    if (socketOpen) {
      console.log('test');
      var message = {
        "toUserId": this.data.otherUserOpenid,
        "senderOpenId": this.data.thisUserOpenid,
        "data": this.data.inputVal,
        "cmd": "txt"
      }
      // 如果打开了socket就发送数据给服务器
      this.sendSocketMessage(message)
    }
  },
  // 监听socket服务器推送回来的消息
  onSocketMessage() {
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage.data)
    })
  },
  // 发送消息
  sendSocketMessage(msg) {
    var that = this;
    console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
    SocketTask.send({
      data: '1233',
      success: function (res) {
        console.log('发送成功', res)
      }
    })
  },
  // 断线重连
  reconnect() {
    if (this.data.lockReconnect) return;
    this.data.lockReconnect = true;
    clearTimeout(this.data.timer)
    if (this.data.limit < 12) {
      this.data.timer = setTimeout(() => {
        this.linkSocket();
        this.data.lockReconnect = false;
      }, 5000);
      this.setData({
        limit: this.data.limit + 1
      })
    }
  },
  initEventHandle() {
    let that = this
    wx.onSocketMessage((res) => {
      // 收到消息
      console.log('收到消息')
      console.log(res)
      if (res.data == "ping"){
        // heartCheck.reset().start()
       } else {
        // 处理数据
       }
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
      // heartCheck.reset().start()
    })
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败')
      this.reconnect()
    })
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      this.reconnect()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('chatRoom onLoad')
    console.log(options)
    this.setData({
      otherUserOpenid: options.otherUserOpenid,
      thisUserOpenid: options.thisUserOpenid
    })
    this.linkSocket()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('页面 onHide')
    this.closeWebSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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