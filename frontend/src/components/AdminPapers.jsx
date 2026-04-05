import React, { useEffect, useState } from 'react';
import { globals } from '../data';

function AdminPapers() {
  const [papers, setPapers] = useState([]);
  const statuses =  [
        "Отправлено",
        "На рецензии",
        "Публикуется",
        "Отклонено"
  ]
  useEffect(() => {
    fetch(`${globals.baseUrl}/api/admin/papers`, { credentials: 'include' })
      .then(res => res.json())
      .then(setPapers);
  }, []);

  const deletePaper = (id) => {
    if (!window.confirm('Удалить статью?')) return;

    fetch(`${globals.baseUrl}/api/admin/papers/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => setPapers(prev => prev.filter(p => p.id !== id)))
      .catch(alert);
  };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>Все статьи</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Название</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Статус</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Дата создания</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>{p.title}</td>
              <td style={{ padding: 10 }}>{statuses[p.status]}</td>
              <td style={{ padding: 10 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: 10 }}>
                <button
                  onClick={() => deletePaper(p.id)}
                  style={{ background: 'crimson', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPapers;