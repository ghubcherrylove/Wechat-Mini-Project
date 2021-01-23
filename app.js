let config = require('./config/index')
let LoginService = require('./services/LoginService')

App({
  onLaunch() {
    //TODO
    let that = this;
    let userStorageInfo = wx.getStorageSync("userInfo");
    if (userStorageInfo) {
      that.globalData.userInfo = userStorageInfo;
    }
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
                if (res.success) {
                  that.globalData.userInfo = res.module.userInfo;
                  that.globalData.Authorization = res.module.token;
                  // wx.setStorageSync("userInfo", res.module.userInfo);
                  wx.setStorageSync("Authorization", res.module.token);
                  console.log(111111)
                  if (callback) {
                    callback(res);
                  }
                } else {
                  that.showInfo(res.message);
                }
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
    Authorization: ''
  }
})
