let ajax = require('../network/ajax')
// let util = require('../utils/util')

// 用户列表
export function list(query = {page: 0, size: 10}) {
  return ajax({url: 'api/user/pagination', query: query, data: {personDTO: {}}, method: 'POST'})
}
// 用户列表
export function getUserInfoByOpenid(openId = '') {
  return ajax({url: 'api/user/' + openId, method: 'GET'})
}
// 完善个人信息
export function info(data = {}) {
  return ajax({url: 'api/user/info', data, method: 'POST'})
}
// 实名认证
export function verify(data = {}) {
  return ajax({url: 'api/user/verify', data, method: 'POST'})
}

// 喜欢
export function like(openId = '') {
  return ajax({url: 'api/user/like/' + openId, method: 'GET'})
}

// 微信生活照上传文件
export function fileUpload(data = {}) {
  return ajax({url: 'api/user/life/fileUpload', data, method: 'POST', header: {'content-type': 'multipart/form-data'}})
}

