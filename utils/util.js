module.exports = {
  getAvatarUrl(ID) {
    return 'http://lorempixel.com/68/68/people/' + ID
  },
  formatSalary(number = 0) {
    if (number >= 10000) {
      return number/10000 + '万'
    }
    return number
  },
  formatDateTime (ms) {
    var date = new Date(ms);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' '+ h + ':' + minute + ':' + second;
  },
  timeFormat(ms) {
    ms = ms * 1000
    let d_second,d_minutes, d_hours, d_days
    let timeNow = new Date().getTime()
    let d = (timeNow - ms)/1000
    d_days = Math.round(d / (24 * 60 * 60))
    d_hours = Math.round(d / (60 * 60))
    d_minutes = Math.round(d / 60)
    d_second = Math.round(d)
    if (d_days > 0 && d_days < 2) {
      return `${d_days} days ago`
    } else if (d_days <= 0 && d_hours > 0) {
      return `${d_hours} hours ago`
    } else if (d_hours <= 0 && d_minutes > 0) {
      return `${d_minutes} minutes ago`
    } else if (d_minutes <= 0 && d_second >= 0) {
      return 'Just now'
    } else {
      let s = new Date()
      s.setTime(ms)
      return [s.getFullYear(), s.getMonth() + 1, s.getDate()].map(this.formatNumber).join('/') + ' ' + [s.getHours(), s.getMinutes()].map(this.formatNumber).join(':')
    }
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
  },
  _param(obj = {}) {
    let _ = encodeURIComponent
    return Object.keys(obj).map(k => `${_(k)}=${_(obj[k])}`).join('&')
  }
}