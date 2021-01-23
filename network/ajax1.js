let API_PATH = 'https://aicloud.thingsmatrix.co/'
import config from '../config/index'

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

function ajax({url = '', query, data, complete, method = 'GET', header = {}}) {
  url = url + '?' + _param(query)
  return new Promise(function(resolve, reject) {
    try {
      wx.request({
        url: config.baseUrl + url,
        data: data,
        method: method,
        header: {...{Authorization: wx.getStorageSync("loginFlag")},...header},
        // header: header,
        success: res => {
          // console.log('请求成功！')
          // console.log(res)
          if (res.statusCode >= 200 && res.statusCode <= 300) {
            resolve(res.data)
          } else {
            let message = codeMessage[res.statusCode];
            wx.showToast({
              title: message || '请求失败!'
            })
            reject(res)
          }
        },
        fail: function(fail) {
          console.log('ajax1 fail')
          console.log(fail)
          let message = codeMessage[fail.statusCode];
          wx.showToast({
            title: message || '请求失败!'
          })
          reject(fail)
        },
        // complete: function(complete) {
        //   console.log('ajax1 complete')
        //   console.log(complete)
        //   let message = codeMessage[complete.statusCode];
        //   wx.showToast({
        //     title: message || '请求失败!'
        //   })
        //   reject(complete)
        // }
      })
    } catch (error) {
      reject(err)
    }
  })
}

module.exports = ajax