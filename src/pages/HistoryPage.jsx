import React, { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { exportOrdersToExcel } from '../utils/exportToExcel'

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage('orderHistory', [])
  const [expenses, setExpenses] = useLocalStorage('dailyExpensesDetailed', {})

  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = Array.from(new Set(history.map(h => h.date))).sort((a, b) => b.localeCompare(a))
    return dates[0] || new Date().toISOString().slice(0, 10)
  })

  const [deleteMode, setDeleteMode] = useState(false)

  const dates = Array.from(new Set(history.map(h => h.date))).sort((a, b) => b.localeCompare(a))

  const ordersForSelectedDate = history.filter(o => o.date === selectedDate)
  const expensesForSelectedDate = expenses[selectedDate] || []

  const cashTotal = ordersForSelectedDate
    .filter(o => o.payment === 'Cash')
    .reduce((sum, o) => sum + o.total, 0)

  const upiTotal = ordersForSelectedDate
    .filter(o => o.payment !== 'Cash')
    .reduce((sum, o) => sum + o.total, 0)

  const expensesTotal = expensesForSelectedDate
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const cashOnHand = cashTotal - expensesTotal
  const netTotal = cashOnHand + upiTotal

  function exportAndClear(dateStr) {
    const orders = history.filter(h => h.date === dateStr)
    const ex = expenses[dateStr] || []
    if (orders.length === 0) {
      alert('No orders for date')
      return
    }
    exportOrdersToExcel(orders, ex, dateStr)
    setHistory(prev => prev.filter(h => h.date !== dateStr))
    const copy = { ...expenses }
    if (copy[dateStr]) delete copy[dateStr]
    setExpenses(copy)
    alert('Export complete and removed exported date from local storage.')
  }

  function deleteOrder(orderNo) {
    if (!window.confirm(`Delete order #${orderNo}?`)) return
    setHistory(prev => prev.filter(o => o.orderNo !== orderNo))
  }

  function printReceipt(order) {
    const rows = order.items.split(", ").map((i) => {
      const [nameQty, qty] = [i.split(" x")[0], i.split(" x")[1]]
      const qtyN = parseInt(qty) || 1
      const price = qtyN * (DEFAULT_MENU.find(m => m.name === nameQty)?.price || 0)
      return `<tr><td>${nameQty}</td><td>${qtyN}</td><td>₹${price}</td></tr>`
    })
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 10px; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 4px; border: 1px solid #000; }
          </style>
        </head>
        <body>
          <h2>Karnavati Dabeli & Vadapav Botad</h2>
          <div>Order No: ${order.orderNo}</div>
          <div>${order.time}</div>
          <div>Order Type: ${order.type}</div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>${rows.join('')}</tbody>
            <tfoot>
              <tr><td colspan="2"><strong>Total</strong></td><td>₹${order.total}</td></tr>
              <tr><td colspan="2"><strong>Payment</strong></td><td>${order.payment}</td></tr>
            </tfoot>
          </table>
        </body>
      </html>`
    const w = window.open("", "_blank", "height=600,width=400")
    if (!w) return alert("Allow popups for printing")
    w.document.write(html)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  // Replace DEFAULT_MENU with your menu or import it
  const DEFAULT_MENU = [
    { id: "1 dabeli", name: "1 Special Dabeli", price: 60 },
    { id: "1 cheese", name: "1 Cheese Dabeli", price: 90 },
    { id: "pav", name: "1 Butter Pav Dabeli", price: 50 },
    { id: "chai", name: "Cutting Chai", price: 15 },
    { id: "fries", name: "Masala Fries", price: 25 },
  ]

  return (
    <div className="container">
      <h2>Order History</h2>

      {/* Delete Mode Toggle Button */}
      <button
        style={{
          position: 'absolute',
          top: '90px',
          right: '36px',
          background: deleteMode ? 'red' : '#555',
          color: 'white',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => setDeleteMode(!deleteMode)}
      >
        {deleteMode ? 'Cancel Delete Mode' : 'Delete Orders'}
      </button>

      <div style={{ display: 'flex', gap: 20, margin: '16px 0' }}>
        <div style={{ padding: 12, background: '#e0f0ff', borderRadius: 8, flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Cash on Hand</div>
          <div style={{ fontSize: 20 }}>₹{cashOnHand.toFixed(2)}</div>
        </div>
        <div style={{ padding: 12, background: '#f0eaff', borderRadius: 8, flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Bank Balance</div>
          <div style={{ fontSize: 20 }}>₹{upiTotal.toFixed(2)}</div>
        </div>
        <div style={{ padding: 12, background: '#ffe0e0', borderRadius: 8, flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Expenses</div>
          <div style={{ fontSize: 20 }}>₹{expensesTotal.toFixed(2)}</div>
        </div>
        <div style={{ padding: 12, background: '#e0ffe0', borderRadius: 8, flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Net Total</div>
          <div style={{ fontSize: 20 }}>₹{netTotal.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {dates.length === 0 ? (
            <option>{new Date().toISOString().slice(0, 10)}</option>
          ) : (
            dates.map(d => <option key={d} value={d}>{d}</option>)
          )}
        </select>
        <button onClick={() => exportAndClear(selectedDate)} className="nav-btn">
          Export & Clear Day
        </button>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Time</th>
              <th>Type</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Actions</th> {/* New column for Print */}
            </tr>
          </thead>
          <tbody>
            {ordersForSelectedDate.map(o => (
              <tr
                key={o.orderNo}
                style={{
                  background: deleteMode ? '#ffe5e5' : 'transparent',
                  cursor: deleteMode ? 'pointer' : 'default'
                }}
                onClick={() => deleteMode && deleteOrder(o.orderNo)}
              >
                <td>{o.orderNo}</td>
                <td>{o.time}</td>
                <td>{o.type}</td>
                <td>{o.items}</td>
                <td>₹{o.total.toFixed(2)}</td>
                <td>{o.payment}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // prevent triggering deleteMode row click
                      printReceipt(o)
                    }}
                  >
                    Print Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
