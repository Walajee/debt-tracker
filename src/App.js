import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import { ref, onValue, set, remove, update } from "firebase/database";

function App() {
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "" });
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const userPath = "debts";

  useEffect(() => {
    const debtsRef = ref(db, userPath);
    onValue(debtsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setDebts(loaded);
    });
  }, []);

  const addDebt = () => {
    if (!form.name || !form.amount || !form.dueDate) return;
    const id = Date.now().toString();
    const newDebt = {
      name: form.name,
      amount: parseFloat(form.amount),
      dueDate: form.dueDate,
      paid: false
    };
    set(ref(db, `${userPath}/${id}`), newDebt);
    setForm({ name: "", amount: "", dueDate: "" });
  };

  const deleteDebt = (id) => remove(ref(db, `${userPath}/${id}`));

  const togglePaid = (id, current) =>
    update(ref(db, `${userPath}/${id}`), { paid: !current });

  const updateDebtDate = (id, newDate) =>
    update(ref(db, `${userPath}/${id}`), { dueDate: newDate });

  const filteredDebts = debts
    .filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()))
    .filter((d) => {
      if (statusFilter === "paid") return d.paid;
      if (statusFilter === "unpaid") return !d.paid;
      return true;
    });

  return (
    <div className="container">
      <h1>Debt Tracker</h1>
      <input className="filter" placeholder="Filter by name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <select className="filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
      <div className="form">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Amount (ILS)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <button onClick={addDebt}>Add</button>
      </div>
      <div className="debts">
        {filteredDebts.map((d) => (
          <div className={`debt-card ${d.paid ? "paid" : ""}`} key={d.id}>
            <div><strong>{d.name}</strong></div>
            <div>ILS {d.amount}</div>
            <div>
              Due: <input type="date" value={d.dueDate} onChange={(e) => updateDebtDate(d.id, e.target.value)} />
            </div>
            <label>
              <input type="checkbox" checked={d.paid} onChange={() => togglePaid(d.id, d.paid)} />
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
