let Dict = {
  store: {
    EDUCATIONS: [
      ['1', '小学'],
      ['2', '初中'],
      ['3', '高中'],
      ['4', '大专'],
      ['5', '本科'],
      ['6', '硕士'],
      ['7', '博士'],
      ['8', '博士后']
    ]
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