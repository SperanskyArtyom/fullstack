import React, { useEffect, useState } from 'react';
import { globals } from '../data';

function PapersToReview() {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState(null);
  const statuses = ["Отправлено", "На рецензии", "Публикуется", "Отклонено"];

  useEffect(() => {
    fetch(`${globals.baseUrl}/api/reviewer/paper`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка загрузки статей");
        return res.json();
      })
      .then(setPapers)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 800, margin: '30px auto' }}>
      {papers.length === 0 ? (
        <p>Нет доступных статей</p>
      ) : (
        papers.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 10 }}>
            <h3>{p.title}</h3>
            <p><b>Дата:</b> {new Date(p.createdAt).toLocaleDateString()}</p>
            <p><b>Категория:</b> {p.category}</p>
            <p><b>Теги:</b> {p.tags}</p>
            <p><b>Статус:</b> {statuses[p.status]}</p>
            {p.status !== 1 && (
              <button onClick={() => window.location.href = `/review/new/${p.id}`}>
                Написать рецензию
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PapersToReview;