let UserService = require('../../services/UserService')
let {Dict} = require('../../utils/consts');
const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    entity: {
      id: "",
      realName: "",
      date: '2021-01-01',
      sex: 0,
      height: "",
      weight: "",
      lifePhotos: "",
      education: 4,
      isMarried: 0,
      job: "",
      phone: "",
      corporation: "",
      salary: "",
      isBuyCar: "1",
      isBuyHouse: "1",
      wechatAccount: "",
      constellation: '8',
    },
    sexs: ['男', '女'],
    // sexs: [
    //   {value: '1', name: '男'},
    //   {value: '0', name: '女'},
    // ],
    constellations: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '魔羯座'],
    marrieds: ['未婚', '已婚', '离异'],
    educations: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '博士后'],
    cars: ['无车', '有车'],
    houses: ['无房', '有房'],
    BUY_CARS: Dict.store.BUY_CARS,
    BUY_HOUSES: Dict.store.BUY_HOUSES
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 通过openid获取用户信息
    if (options.openid) {
      UserService.getUserInfoByOpenid(options.openid).then(res => {
        console.log('res')
        console.log(res)
        if (res.code === 0) {
          this.setData({entity: {...res.data.userInfo, birthDate: util.formatDateDay(res.data.userInfo.birthDate)}})
        }
      })
    }
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