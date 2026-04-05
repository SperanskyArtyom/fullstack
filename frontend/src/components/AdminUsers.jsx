import React, { useEffect, useState } from 'react';
import { globals } from '../data';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', type: 'Author' });

  const types = ["Author", "Reviewer", "Admin"];

  useEffect(() => {
    fetch(`${globals.baseUrl}/api/admin/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Удалить пользователя?")) return;

    fetch(`${globals.baseUrl}/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка удаления");
        setUsers(prev => prev.filter(u => u.id !== id));
      })
      .catch(alert);
  };

  const handleCreate = () => {
    fetch(`${globals.baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка создания пользователя');
        return res.json();
      })
      .then(newUser => setUsers(prev => [...prev, newUser]))
      .catch(alert);
  };

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>Управление пользователями</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Email</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Пароль</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Тип</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>{u.email}</td>
              <td style={{ padding: 10 }}>{u.password}</td>
              <td style={{ padding: 10 }}>{types[u.type]}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(u.id)} style={{ background: 'crimson', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Создать нового пользователя</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: 8, flex: 1 }}
        />
        <input
          placeholder="Пароль"
          value={form.password}
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: 8, flex: 1 }}
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          style={{ padding: 8 }}
        >
          <option value="Author">Author</option>
          <option value="Reviewer">Reviewer</option>
        </select>
        <button
          onClick={handleCreate}
          style={{ background: 'green', color: '#fff', padding: '8px 12px', border: 'none', cursor: 'pointer' }}
        >
          Создать
        </button>
      </div>
    </div>
  );
}

export default AdminUsers;