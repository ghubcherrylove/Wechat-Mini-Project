let ajax = require('../network/ajax1')
// let util = require('../utils/util')

// 用户列表
export function list(data = {}) {
  return ajax({url: 'api/user/pagination', query: data, data: {personDTO: {}}, method: 'POST'})
}
// 退出
export function logout(data = {}) {
  return ajax({url: 'api/user/logout', data, method: 'POST'})
}

