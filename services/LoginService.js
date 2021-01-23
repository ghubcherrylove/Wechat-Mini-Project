let ajax = require('../network/ajax')

// 登录
export function login(data = {}) {
  return ajax({url: 'api/auth/login', data, method: 'POST'})
}
// 退出
export function logout(data = {}) {
  return ajax({url: 'api/auth/logout', data, method: 'POST'})
}

