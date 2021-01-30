const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var socketOpen = false;
var url = 'wss://www.aicloud.site/webSocket/';
var upload_url = 'https://www.aicloud.site/file/upload'
import request from '../../utils/request'
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  msgList = [{
    speaker: 'others',
    contentType: 'text',
    content: '你好'
  }]
  that.setData({
    msgList,
    inputVal
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '',
    scrollHeight: '100%',
    inputBottom: 0,
    otherName: "",
    inputVal: '',
    imgUrl: '',
    otherUserOpenid: '',
    thisUserOpenid: '',
    theOtherAvatarUtl: ''
  },

  changeOtherName: function () {
    wx.setNavigationBarTitle({
      title: this.data.otherName
    })
  },
  getUserInput: function (e) {
    this.data.inputVal = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('chat onLoad')
    console.log(app)
    console.log(options)
    // this.data.otherUserOpenid = options.otherUserOpenid;
    // this.data.thisUserOpenid = options.thisUserOpenid;
    // console.log(options);
    this.setData({
      otherUserOpenid: options.otherUserOpenid,
      thisUserOpenid: options.thisUserOpenid
    })
    initData(this);
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      otherName: options.doctorName
    });
    this.changeOtherName();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let i = 0;
    let authnizatin = wx.getStorageSync("Authorization");
    request.get('/api/chat/loadMessage', {
      toOpenId: this.data.otherUserOpenid
    }, {
      Authorization: authnizatin
    }).then(res => {
      res.data.data.forEach((item) => {
        if (this.data.thisUserOpenid == item.senderOpenId) { //对方说的
          this.setData({
            ['msgList[' + i + ']']: {
              speaker: 'our',
              contentType: 'text',
              content: item.data
            }
          })
        } else { //自己说的
          this.setData({
            ['msgList[' + i + ']']: {
              speaker: 'others',
              contentType: 'text',
              content: item.data
            }
          })
        }
        i++;
      })
      // 加载自动到底部（消息输入框的位置）
      let query = wx.createSelectorQuery();
      query.select('#inputValue').boundingClientRect(rect=>{
      let keyHeight = rect.height;
        this.setData({
          scrollHeight: (windowHeight - keyHeight) + 'px'
        });
        this.setData({
          toView: 'msg-' + (res.data.data.length - 1),
          inputBottom: keyHeight + 'px'
        })
      }).exec();
    })
  },
  onReady: function () {
    var that = this;

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
   * 获取聚焦
   */
  focus: function (e) {
    console.log('111111111111111111')
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100%',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },
  submitTo: function () {
    console.log("imputval  " + this.data.inputVal)
    if (!this.data.inputVal) {
      wx.showToast({
        title: '不能发送空内容',
        icon: 'none'
      })
      return
    }
    console.log('submit to');
    var message = {
      "toUserId": this.data.otherUserOpenid,
      "senderOpenId": this.data.thisUserOpenid,
      "data": this.data.inputVal,
      "cmd": "txt"
    }
    // 如果打开了socket就发送数据给服务器
    sendSocketMessage(message)

    msgList.push({
      speaker: 'our',
      contentType: 'text',
      content: this.data.inputVal
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  },
  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);

        that.data.imgUrl = res.tempFilePaths[0]
        if (socketOpen) {
          console.log('test');
          // 如果打开了socket就发送数据给服务器
          sendSocketMessage(this.data.imgUrl)
        }
        console.log('uploadFile');
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'file',
          url: "https://www.aicloud.site/upload",
          formData: {
            'user': '落花人独立'
          },
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json'
          },
          complete: (res) => {
            console.log(res);
          }
        })
        console.log('uploadFile完成');
      }
    })
  },
  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    if (socketOpen) {
      console.log('test');
      // 如果打开了socket就发送数据给服务器
      var content = this.data.inputVal
      sendSocketMessage(this.data.inputVal)
    }
    msgList.push({
      speaker: 'our',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
    console.log(e);
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  app.globalData.SocketTask.send({
    data: JSON.stringify(msg),
    success: function (res) {
      console.log('已发送', res)
    }
  })
}