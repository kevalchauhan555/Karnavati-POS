import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportOrdersToExcel(orders, expensesForDate = [], dateString = '') {
  if (!orders || orders.length === 0) return null
  const rows = orders.map(o => ({
    'Order No': o.orderNo,
    Time: o.time,
    Type: o.type,
    Items: o.items,
    Total: o.total,
    Payment: o.payment,
    Date: o.date
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, 'Orders')

  const summary = [
    { Key: 'Date', Value: dateString },
    { Key: 'Orders Count', Value: orders.length },
    { Key: 'Orders Total', Value: orders.reduce((s,o)=>s+o.total,0) },
    { Key: 'Expenses Total', Value: (expensesForDate||[]).reduce((s,e)=>s+(e.amount||0),0) }
  ]
  const ws2 = XLSX.utils.json_to_sheet(summary)
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, `orders_${dateString || 'export'}.xlsx`)
  return true
}
