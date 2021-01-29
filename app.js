let config = require('./config/index')
let LoginService = require('./services/LoginService')
let baseUrl = 'http://localhost:8000'
var url = 'ws://localhost:8000/webSocket/';

// WebSocket 心跳对象
let heartCheck = {
  timeout: 5000, 
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
   this.timeoutObj = setInterval(()=> {
    wx.sendSocketMessage({
     data:"ping",
     success(){
      // console.log("发送ping成功");
     }
    });
   }, 10000);
  }
 };

App({
  onLaunch() {
    //TODO
    let that = this;
    let userStorageInfo = wx.getStorageSync("userInfo");
    if (userStorageInfo) {
      that.globalData.userInfo = userStorageInfo;
    }
  },
  ///上传单个文件
  uploadFile (url, filePath = '', param) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: baseUrl + 'api/' + url, //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'files',
        formData: param,
        header: {Authorization: wx.getStorageSync("Authorization"), 'content-type': 'multipart/form-data'},
        success (res) { //上传成功
          // console.log('上传图片成功')
          // console.log(res)
          //成功调用接口
          resolve(JSON.parse(res.data));
        },
        fail(err){
          console.log('保存图片失败!')
          console.log(err)
          wx.showToast({ title: '请求失败,请刷新后重试', icon: 'error' });
          reject(err)
        }
      })
    })
  },
  onHide() {
    // 关闭WebSocket
    this.globalData.SocketTask.close()
  },
  // 短线重连
  reconnect() {
    if (this.globalData.lockReconnect) return;
    this.globalData.lockReconnect = true;
    this.globalData.lockReconnect = true;
    clearTimeout(this.globalData.timer)
    if (this.globalData.limit < 12) {
     this.globalData.timer = setTimeout(() => {
      this.webSocket();
      this.globalData.lockReconnect = false;
     }, 5000);
     this.globalData.limit = this.globalData.limit + 1
    }
  },
  initEventHandle() {
    let that = this
    wx.onSocketMessage((res) => {
      
      //收到消息
      if (JSON.parse(res.data).data == "pong"){
        heartCheck.reset().start()
       } else {
        // 处理数据
        var pages = getCurrentPages();
        var routes = pages.map(pa=>pa.route)
        if(routes.indexOf("pages/chat/chat") > -1){
          console.log("包含++++++++++")
          this.msgList.push({
            speaker: 'others',
            contentType: 'text',
            content: JSON.parse(res.data).data
          })
          this.setData({
            msgList
          });
        }
       } 
    })
    wx.onSocketOpen(()=>{
      console.log('app WebSocket连接打开')
      heartCheck.reset().start()
    })
    wx.onSocketError(function (res) {
      console.log('app WebSocket连接打开失败')
      that.reconnect()
    })
    wx.onSocketClose(function (res) {
      console.log('app WebSocket 已关闭！')
      that.reconnect()
    })
  },
  // webSocket连接
  webSocket: function () {
    let that = this;
    let auth =  wx.getStorageSync("Authorization");
    let userInfo =  wx.getStorageSync("userInfo");
    // 创建Socket
    this.globalData.SocketTask = wx.connectSocket({
      url: url + userInfo.openId +"?"+"Authorization="+auth,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        // socketOpen = true;
        console.log('WebSocket连接创建', res);
        that.initEventHandle()
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },
   // 公共登录动作 
   doLogin: function (callback = () => {}) {
    let that = this;
    wx.login({
      success: function (loginRes) {
        if (loginRes.code) {
          /*
           * @desc: 获取用户信息 期望数据如下
           *
           * @param: userInfo       [Object]
           * @param: rawData        [String]
           * @param: signature      [String]
           * @param: encryptedData  [String]
           * @param: iv             [String]
           **/
          wx.getUserInfo({
            withCredentials: true, // 非必填, 默认为true
            success: function (infoRes) {
              // 请求服务端的登录接口
              LoginService.login({
                authType: 1,  //1代表微信端登录
                userName: "",
                password: "",
                code: loginRes.code, // 临时登录凭证
                rawData: infoRes.rawData, // 用户非敏感信息
                signature: infoRes.signature, // 签名
                encryptedData: infoRes.encryptedData, // 用户敏感信息
                iv: infoRes.iv, // 解密算法的向量
                token: wx.getStorageSync("Authorization"),
              }).then(res => {
                console.log('app doLogin')
                console.log(res)
                if (res.code === 0) {
                  that.globalData.userInfo = res.data.module.userInfo;
                  that.globalData.Authorization = res.data.module.token;
                  wx.setStorageSync("userInfo", res.data.module.userInfo);
                  wx.setStorageSync("Authorization", res.data.module.token);
                  that.webSocket();
                  console.log(111111)
                  if (callback) {
                    callback(res);
                  }
                } else {
                  that.showInfo(res.message);
                }
              }, err => {
                console.log('app login err')
                console.log(err)
              })
            },
            fail: function (error) {
              console.log(error);
              // 获取 userInfo 失败，去检查是否未开启权限
              that.showInfo("调用request接口失败");
            },
          });
        } else {
          // 获取 code 失败
          that.showInfo("登录失败");
          console.log("调用wx.login获取code失败");
        }
      },
      fail: function (error) {
        // 调用 wx.login 接口失败
        that.showInfo("接口调用失败");
        console.log(error);
      },
    });
  },
  // 封装 wx.showToast 方法
  showInfo: function (info = "error", icon = "none") {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 2000,
      mask: false,
    });
  },
  getUserInfo(cb) {
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: _ => {
          wx.getUserInfo({
            success: res => {
              console.log('app res')
              console.log(res)
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    SocketTask: null, // 全局webSocket，
    serverTimeoutObj: null,
    timeoutObj: null,
    timeout: 10000,
    lockReconnect: false,
    timer: null,
    limit: 1,
    Authorization: ''
  }
})
