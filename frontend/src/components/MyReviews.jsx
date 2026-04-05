import React, { useEffect, useState } from 'react';
import { globals } from '../data';
function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${globals.baseUrl}/api/reviews/mine`, {
      method: "GET",
      credentials:"include"
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось загрузить ревью');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (reviews.length === 0) {
    return <p>Вы ещё не создавали ревью.</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Мои ревью</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '8px' }}>Статья</th>
            <th style={{ padding: '8px' }}>Оценка</th>
            <th style={{ padding: '8px' }}>Рекомендация</th>
            <th style={{ padding: '8px' }}>Дата статьи</th>
            <th style={{ padding: '8px' }}>Статус</th>
            <th style={{ padding: '8px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>            {r.paperTitle.length > 30
                  ? r.paperTitle.substring(0, 30) + '...'
                  : r.paperTitle}</td>
              <td style={{ padding: '8px', textAlign: 'center' }} calss="td1">{r.score}</td>
              <td style={{ padding: '8px' }}>
                {r.recommendation.length > 30
                  ? r.recommendation.substring(0, 30) + '...'
                  : r.recommendation}
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                {new Date(r.paperCreatedAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                {r.isDraft ? 'В процессе' : 'Выполнено'}
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                <a href={`/reviews/edit/${r.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                  Редактировать
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default MyReviews;