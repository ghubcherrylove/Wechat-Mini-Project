let API_PATH = 'http://localhost:8000'
import config from '../config/index'
let app = getApp()

// http状态码对应的默认文本提醒
const codeMessage = {
  200: '操作成功',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '参数错误',
  401: '需要用户验证',
  403: '用户无权限',
  404: '资源不存在',
  405: '不支持的操作方法',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器内部错误',
  502: '应用程序错误',
  503: '维护中',
  504: '网关超时',
}

function _param(obj = {}) {
    let _ = encodeURIComponent
    return Object.keys(obj).map(k => `${_(k)}=${_(obj[k])}`).join('&')
}

function ajax({url = '', query, data, complete = () => {}, method = 'GET', header = {}}) {
  url = url + '?' + _param(query)
  return new Promise(function(resolve, reject) {
    try {
      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: config.baseUrl + url,
        data: data,
        method: method,
        header: {...{Authorization: wx.getStorageSync("Authorization")},...header},
        success: res => {
          wx.hideLoading()
          console.log('后端返回的数据')
          console.log(res)
          // res = {cookies: [], data: {code: 0, msg: '', data: {}}, errMsg: '', header: {}, statusCode: 200}
          if (res.statusCode >= 200 && res.statusCode <= 300) { // http协议的状态码
            if (res.data.code === 0) { // 这是与后端定义的成功标识
              resolve(res.data)
            } else {
              let message = res.data.msg;
              wx.showToast({
                icon: 'error',
                title: message || '请求失败!'
              })
              reject(res.data)
            }
          } else {
            let message = codeMessage[res.statusCode];
            wx.showToast({
              icon: 'error',
              title: message || '请求失败!'
            })
            if (res.statusCode === 401) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
            // reject(res.data)
          }
        },
        fail: function(fail) {
          let message = codeMessage[fail.statusCode];
          wx.showToast({
            icon: 'error',
            title: message || '请求失败!'
          })
          reject(fail)
        },
      })
    } catch (error) {
      reject(err)
    }
  })
}

module.exports = ajax