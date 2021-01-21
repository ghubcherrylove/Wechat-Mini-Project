// educationMap = [
//   {key: "1", name: "小学"},
//   {key: "2", name: "初中"},
//   {key: "3", name: "高中"},
//   {key: "4", name: "大专"},
//   {key: "5", name: "本科"},
//   {key: "6", name: "硕士"},
//   {key: "7", name: "博士"},
//   {key: "8", name: "博士后"}
// ]

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