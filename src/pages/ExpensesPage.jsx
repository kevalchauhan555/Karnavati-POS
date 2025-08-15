import React from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import ExpenseForm from '../components/ExpenseForm'
import { exportOrdersToExcel } from '../utils/exportToExcel'

export default function ExpensesPage() {
  // Use today's date, removing the need for a date picker
  const today = new Date().toISOString().slice(0, 10)

  // This is the same local storage key as the HistoryPage
  const [expenses, setExpenses] = useLocalStorage('dailyExpensesDetailed', {})
  const [orderHistory] = useLocalStorage('orderHistory', [])

  // All actions will now use the expenses for the current day
  const expensesForDate = expenses[today] || []

  function addExpense(amount, desc) {
    if (!amount || !desc) {
      alert('Amount and description required')
      return
    }
    setExpenses(prev => {
      const prevForDate = prev[today] || []
      return { ...prev, [today]: [...prevForDate, { amount, desc }] }
    })
  }

  function deleteExpense(index) {
    setExpenses(prev => {
      const prevForDate = prev[today] || []
      const newList = [...prevForDate]
      newList.splice(index, 1)
      return { ...prev, [today]: newList }
    })
  }

  return (
    <div className="container">
      <h2>Expenses for Today ({today})</h2>
      <ExpenseForm
        onAdd={addExpense}
        list={expensesForDate}
        onDelete={deleteExpense}
      />
      <div style={{ marginTop: 20 }}>
        <button
          className="nav-btn"
          onClick={() => exportOrdersToExcel(orderHistory, expensesForDate, today)}
        >
          Export Orders + Expenses for Today
        </button>
      </div>
    </div>
  )
}