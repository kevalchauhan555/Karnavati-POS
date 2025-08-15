import React, { useState } from 'react';

export default function ExpenseForm({ onAdd, list, onDelete }) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(Number(amount), desc);
    setAmount('');
    setDesc('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <button type="submit" className="nav-btn">Add Expense</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((expense, index) => (
            <tr key={index}>
              <td>₹{expense.amount.toFixed(2)}</td>
              <td>{expense.desc}</td>
              <td>
                <button className="del-btn" onClick={() => onDelete(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}