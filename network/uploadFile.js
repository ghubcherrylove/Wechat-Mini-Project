let API_PATH = 'http://localhost:8000/'
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

///上传单个文件
const uploadFile = (url, filePath, param, header) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: config.baseUrl + url, //仅为示例，非真实的接口地址
      filePath:filePath,
      name: 'file',
      formData: param,
      header: {...{Authorization: wx.getStorageSync("Authorization")},...header},
      success (res){ //上传成功
        console.log(res)
        //成功调用接口
        resolve(JSON.parse(res.data));
      },
      fail(err){
        console.log(err)
        wx.showToast({ title: '请求失败,请刷新后重试', icon: 'error' });
        reject(err)
      }
    })
  })
}

module.exports = uploadFile