// let API_PATH = 'https://aicloud.thingsmatrix.co/'
let API_PATH = 'https://www.aicloud.site/'

function _param(obj = {}) {
    let _ = encodeURIComponent
    return Object.keys(obj).map(k => `${_(k)}=${_(obj[k])}`).join('&')
}

function ajax({url, query, data, success, fail, complete, method = 'GET', header}) {
  url = API_PATH + url + '?' + _param(query)
  wx.request({
    url: url,
    data: data,
    method: method,
    header: header,
    success: res => {
        let data = res.data
        // data['status'] === '200' ? success(data) : fail(res)
        res.statusCode === 200 ? success(res) : fail(res)
    },
    fail: fail,
    complete: complete
  })
}

module.exports = ajax