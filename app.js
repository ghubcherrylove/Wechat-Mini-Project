let ajax = require('./network/ajax')

App({
  onLaunch() {
   //TODO
   let that = this;
    let userStorageInfo = wx.getStorageSync("userInfo");
    if (userStorageInfo) {
      that.globalData.userInfo = userStorageInfo;
    }
  },
  getUserInfo(cb) {
    console.log('app')
    console.log(this.globalData.userInfo)
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
  // 全局登录方法
  login(callback = () => {}) {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true, // 非必填, 默认为true
            success: function (userinfo) {
              console.log('用户信息')
              console.log(userinfo)
              that.globalData.userInfo = userinfo;
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
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
                    header: {
                      'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    success: res => {
                      console.log('登录成功，后端并返回openid给前端')
                      console.log(res)
                      wx.setStorage({data: res.data.openid, key: 'openid'})
                      callback(res)
                    },
                    fail: function (fail) {
                      console.log('登录失败')
                      callback(fail)
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
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
})
