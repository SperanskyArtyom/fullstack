import React, { useEffect, useState } from 'react';
import { globals } from '../data';
function MyPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statuses =  [
        "Отправлено",
        "На рецензии",
        "Публикуется",
        "Отклонено"
  ]
  useEffect(() => {
    fetch(`${globals.baseUrl}/api/my-papers`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке');
        return res.json();
      })
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{color: 'red'}}>Ошибка: {error}</p>;

  if (papers.length === 0) return <p>У вас пока нет статей.</p>;

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>Мои статьи</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Заголовок</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Дата создания</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {papers.map(paper => (
            <tr
              key={paper.id}
              style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onClick={() => window.location.href = `/papers/${paper.id}`}
            >
              <td style={{ padding: '8px' }}>{paper.title}</td>
              <td style={{ padding: '8px' }}>{new Date(paper.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '8px' }}>{statuses[paper.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyPapers;