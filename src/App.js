
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({ name: '', amount: '', due: '', description: '' });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("debts");
    if (saved) setDebts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addDebt = () => {
    if (!form.name || !form.amount) return;
    const newDebt = {
      ...form,
      amount: parseFloat(form.amount),
      id: Date.now(),
      paid: false,
    };
    setDebts([...debts, newDebt]);
    setForm({ name: '', amount: '', due: '', description: '' });
  };

  const markPaid = (id) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, paid: !debt.paid } : debt));
  };

  const updateDueDate = (id, newDate) => {
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, due: newDate } : debt
    ));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS"
    }).format(amount);

  const filtered = debts.filter(debt => {
    if (filter === "paid") return debt.paid;
    if (filter === "unpaid") return !debt.paid;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "due") return new Date(a.due) - new Date(b.due);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const total = sorted.reduce((acc, debt) => debt.paid ? acc : acc + debt.amount, 0);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(debts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debts");
    XLSX.writeFile(workbook, "debts.xlsx");
  };

  return (
    <div className="App">
      <h1>Debt Tracker</h1>

      <div className="form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Due Date" type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} />
        <button onClick={addDebt}>Add</button>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>

      <div className="controls">
        <select onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="amount">Amount</option>
          <option value="due">Due Date</option>
          <option value="name">Name</option>
        </select>
        <select onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Amount</th><th>Due</th><th>Paid?</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(debt => (
            <tr key={debt.id}>
              <td>{debt.name}</td>
              <td>{formatCurrency(debt.amount)}</td>
              <td>
                {editingId === debt.id ? (
                  <input
                    type="date"
                    value={debt.due}
                    onChange={(e) => updateDueDate(debt.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => setEditingId(debt.id)} style={{ cursor: "pointer", color: "#007bff" }}>
                    {debt.due || "—"} ✎
                  </span>
                )}
              </td>
              <td><input type="checkbox" checked={debt.paid} onChange={() => markPaid(debt.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <p><strong>Total Owed:</strong> {formatCurrency(total)}</p>
      </div>
    </div>
  );
}

export default App;
