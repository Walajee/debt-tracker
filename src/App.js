import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem("debts");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "" });
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addDebt = () => {
    if (!form.name || !form.amount || !form.dueDate) return;
    setDebts([
      ...debts,
      { ...form, id: Date.now(), amount: parseFloat(form.amount), paid: false },
    ]);
    setForm({ name: "", amount: "", dueDate: "" });
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const togglePaid = (id) => {
    setDebts(
      debts.map((d) => (d.id === id ? { ...d, paid: !d.paid } : d))
    );
  };

  const updateDebtDate = (id, newDate) => {
    setDebts(
      debts.map((d) => (d.id === id ? { ...d, dueDate: newDate } : d))
    );
  };

  const filteredDebts = debts
    .filter((d) =>
      d.name.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((d) => {
      if (statusFilter === "paid") return d.paid;
      if (statusFilter === "unpaid") return !d.paid;
      return true;
    });

  return (
    <div className="container">
      <h1>Debt Tracker</h1>
      <input
        className="filter"
        placeholder="Filter by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <select
        className="filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>

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
        {filteredDebts.map((d) => (
          <div className={`debt-card ${d.paid ? "paid" : ""}`} key={d.id}>
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
            <label>
              <input
                type="checkbox"
                checked={d.paid}
                onChange={() => togglePaid(d.id)}
              />
              Paid
            </label>
            <button onClick={() => deleteDebt(d.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
