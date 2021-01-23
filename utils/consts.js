let Dict = {
  store: {
    EDUCATIONS: {'1': '小学', '2': '初中', '3': '高中', '4': '大专', '5': '本科', '6': '硕士', '7': '博士', '8': '博士后'},
    BUY_CARS: {'0': '无车', '1': '有车'},
    BUY_HOUSES: {'0': '无房', '1': '有房'},
    MARRIEDS: {'0': '未婚', '1': '已婚', '2': '离异'}
  },
  getEntry: function (key, storeArr) {
    let arr = storeArr || []
    return arr.find((entry) => entry[0] == key)
  },
  getText: function (key, storeArr) {
    let tmp = this.getEntry(key, storeArr)
    return tmp ? tmp[1] : '-'
  }
}
export {
  Dict
}