import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem("debts");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "" });

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addDebt = () => {
    if (!form.name || !form.amount || !form.dueDate) return;
    setDebts([
      ...debts,
      { ...form, id: Date.now(), amount: parseFloat(form.amount) },
    ]);
    setForm({ name: "", amount: "", dueDate: "" });
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const updateDebtDate = (id, newDate) => {
    setDebts(
      debts.map((d) =>
        d.id === id ? { ...d, dueDate: newDate } : d
      )
    );
  };

  return (
    <div className="container">
      <h1>Debt Tracker</h1>
      <div className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Amount (ILS)"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <button onClick={addDebt}>Add</button>
      </div>
      <div className="debts">
        {debts.map((d) => (
          <div className="debt-card" key={d.id}>
            <div><strong>{d.name}</strong></div>
            <div>ILS {d.amount}</div>
            <div>
              Due: 
              <input
                type="date"
                value={d.dueDate}
                onChange={(e) => updateDebtDate(d.id, e.target.value)}
              />
            </div>
            <button onClick={() => deleteDebt(d.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
