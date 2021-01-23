let API_PATH = 'https://aicloud.thingsmatrix.co/'
// let API_PATH = 'http://localhost:8000/'

function _param(obj = {}) {
    let _ = encodeURIComponent
    return Object.keys(obj).map(k => `${_(k)}=${_(obj[k])}`).join('&')
}

function ajax({url, query, data, success, fail, complete, method = 'GET', header}) {
  // url = API_PATH + url + '?' + _param(query)
  wx.request({
    url: API_PATH + url,
    data: data,
    method: method,
    header: header,
    success: res => {
        res.success ? success(res) : fail(res)
    },
    fail: fail,
    complete: complete
  })
}

module.exports = ajax