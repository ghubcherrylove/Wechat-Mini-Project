const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://aicloud.thingsmatrix.co/webSocket/';
var upload_url ='https://www.aicloud.site/file/upload'
import request from '../../utils/request'
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  msgList = [
    {
      speaker: 'others',
      contentType: 'text',
      content: '你好'
    }
  ]
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
    scrollHeight: '100%',
    inputBottom: 0,
    otherName:"",
    inputVal: '',
    imgUrl: '',
    otherUserOpenid: '',
    thisUserOpenid: '',
    theOtherAvatarUtl: ''
  },

  changeOtherName:function(){
    wx.setNavigationBarTitle({
      title:this.data.otherName
    })
  },
  getUserInput: function(e) {
    this.data.inputVal = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('chat onLoad')
    console.log(app)
    this.data.otherUserOpenid = options.otherUserOpenid;
    this.data.thisUserOpenid = options.thisUserOpenid;
    console.log(options);
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
  onShow: function() {
    let i = 0;  
    let authnizatin =  wx.getStorageSync("Authorization");
    request.get('/api/chat/loadMessage',{toOpenId: this.data.otherUserOpenid},{Authorization:authnizatin}).then(res => {
      res.data.data.forEach((item) => {
        console.log(item)
        if (this.data.thisUserOpenid == item.senderOpenId) {//对方说的
          this.setData({
            ['msgList['+i+']'] : {
              speaker: 'our',
              contentType: 'text',
              content: item.data
            }
          })
        } else {//自己说的
          this.setData({
            ['msgList['+i+']'] : {
              speaker: 'others',
              contentType: 'text',
              content: item.data
            }
          })
        }
        i++;
      })
    })
    if (!socketOpen) {
      this.webSocket()
    }
  },
  onReady: function () {
    var that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      msgList.push({
        speaker: 'others',
        contentType: 'text',
        content: JSON.parse(onMessage.data).data
      })
      this.setData({
        msgList
      });
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage.data)
    })
  },
  webSocket: function () {
    let auth =  wx.getStorageSync("Authorization");
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url + this.data.thisUserOpenid+"?"+"Authorization="+auth,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        socketOpen = true;
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
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
  blur: function(e) {
    this.setData({
      scrollHeight: '100%',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },
  submitTo: function () {
    if (!inputVal) {
      wx.showToast({
        title: '不能发送空内容',
        icon: 'none'
      })
      return
    }
    if (socketOpen) {
      console.log('test');
      var message = {"toUserId":this.data.otherUserOpenid,"senderOpenId":this.data.thisUserOpenid,"data":this.data.inputVal,"cmd":"txt"}
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(message)
    }
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
  upImg: function() {
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
          url: "http://localhost:8000/upload",
          formData: {
            'user': '落花人独立'
          },
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json'},
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
  sendClick: function(e) {
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
  toBackClick: function() {
    wx.navigateBack({})
  }

})
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
}

