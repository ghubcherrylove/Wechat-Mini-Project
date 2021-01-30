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
      selfIntroduction: ""
    },
    formData: {
      id: "",
      realName: "",
      date: '2021-01-01',
      gender: 0,
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
      selfIntroduction: ""
    },
    genders: [
        {name: '男', value: '1', checked: true},
        {name: '女', value: '0'}
    ],
    constellations: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '魔羯座'],
    marrieds: ['未婚', '已婚', '离异'],
    educations: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '博士后'],
    cars: ['无车', '有车'],
    houses: ['无房', '有房'],
    BUY_CARS: Dict.store.BUY_CARS,
    BUY_HOUSES: Dict.store.BUY_HOUSES,
    rules: [
      // {
      //   name: 'realName',
      //   rules: {required: true, message: '姓名必填'},
      // },
      {
        name: 'height',
        rules: {required: true, message: '身高必填'},
      },
      {
        name: 'weight',
        rules: {required: true, message: '体重必填'},
      },
      {
        name: 'salary',
        rules: {required: true, message: '月收入必填'},
      }
    ]
  },
  // 是否有车
  bindIsBuyCarChange(e) {
    let str = 'entity.isBuyCar';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 学历
  bindEducationChange(e) {
    let str = 'entity.education';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 婚姻
  bindIsMarriedChange(e) {
    let str = 'entity.isMarried';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 是否有房
  bindIsBuyHouseChange(e) {
    let str = 'entity.isBuyHouse';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 星座
  bindConstellationChange(e) {
    let str = 'entity.constellation';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 性别改变
  bindSexChange(e) {
    let str = 'entity.gender';
    this.setData({
      [str]: e.detail.value
    })
  },
  // 出生日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let str = 'entity.date';
    this.setData({
      [str]: e.detail.value
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`entity.${field}`]: e.detail.value
    })
  },
  // 表单提交
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.realName) {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
      return
    }
    if (!e.detail.value.height) {
      wx.showToast({
        icon: 'none',
        title: '请输入身高',
      })
      return
    }
    if (!e.detail.value.weight) {
      wx.showToast({
        icon: 'none',
        title: '请输入体重',
      })
      return
    }
    if (!e.detail.value.salary) {
      wx.showToast({
        icon: 'none',
        title: '请输入月收入',
      })
      return
    }
    if (!e.detail.value.phone) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机',
      })
      return
    }
    if (!e.detail.value.job) {
      wx.showToast({
        icon: 'none',
        title: '请输入职业',
      })
      return
    }
    // 保存到后端
    UserService.info(e.detail.value).then(res => {
      console.log('完善信息成功')
      console.log(res)
      // 回到我的tar页
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          wx.showToast({
            title: errors[firstError[0]].message || '校验不通过',
            icon: 'error'
          })
        }
      } else {
        console.log('entity')
        console.log(this.data.entity)
        UserService.verify(this.data.entity).then(res => {
          wx.switchTab({
            url: '/pages/settings/settings',
          })
        })
      }
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.realName) {
      wx.showToast({
        icon: 'none',
        title: '请填写姓名',
      })
    }
    // if (!e.detail.value.idCard) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请填写身份证号',
    //   })
    // }
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
    if (options.openId) {
      UserService.getUserInfoByOpenid(options.openId).then(res => {
        if (res.code === 0) {
          // 获取本地的用户信息
          let userStorageInfo = wx.getStorageSync("userInfo");
          this.setData({entity: {...res.data.userInfo, realName: userStorageInfo.nickName || '', gender: userStorageInfo.gender || ''}})
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