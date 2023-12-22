import XLSX from 'xlsx'

export type ISheetDate = [
  string,
  string,
  string,
  string,
  string,
  string,
  string
]

interface IOptions {
  category: string
  addHead: boolean
}
const saveData = (data: ISheetDate[], { category, addHead }: IOptions) => {
  console.log('🚀 ~ file: sheet.ts:18 ~ saveData ~ addHead:', addHead, category)
  const header = [
    ['分类', '品牌', '名称', '故障类型', '故障标题', '故障描述', '维修价格'],
  ]
  const workbook = XLSX.readFile('message.xlsx')
  // const wsname = workbook.SheetNames[0]
  let worksheet
  if (addHead) {
    worksheet = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.sheet_add_aoa(worksheet, header, { origin: 'A1' })
    XLSX.utils.book_append_sheet(workbook, worksheet, category)
  }
  worksheet = workbook.Sheets[category]
  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: -1 })

  XLSX.writeFile(workbook, 'message.xlsx', { compression: true })
}

export default saveData
