import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { globals } from '../data';

function PaperDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [error, setError] = useState(null);
  const statuses = ["Отправлено", "На рецензии", "Публикуется", "Отклонено"];
   const themes = [
        "Медицина",
        "Технологии",
        "Множественная"
   ]     
  useEffect(() => {
    fetch(`${globals.baseUrl}/api/papers/${id}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при загрузке статьи");
        return res.json();
      })
      .then(data => setPaper(data))
      .catch(err => setError(err.message));
  }, [id]);

  const loadReviews = () => {
    if (reviews.length > 0) return; // не загружать повторно
    fetch(`${globals.baseUrl}/api/papers/${id}/reviews`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при загрузке рецензий");
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(err => setError(err.message));
  };

  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;
  if (!paper) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 800, margin: '30px auto' }}>
      <button onClick={() => navigate('/dashboard')} style={buttonStyle}>Назад</button>
      <h3 style={{ marginTop: 20 }}>О статье</h3>
      <h2>{paper.title}</h2>
      <p><b>Дата:</b> {new Date(paper.createdAt).toLocaleDateString()}</p>
      <p><b>Категория:</b> {themes[paper.category]}</p>
      <p><b>Теги:</b> {paper.tags?.split(',').join(', ')}</p>
      <p><b>Статус:</b> {statuses[paper.status]}</p>
      {paper.imagePath && (
        <img
          src={globals.baseUrl + paper.imagePath}
          alt="preview"
          style={{ maxWidth: '100%', margin: '20px 0', borderRadius: 8 }}
        />
      )}
      <p><b>Текст:</b></p>
      <div style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{paper.content}</div>

      {paper.status !== 0 && (
        <div style={{ marginTop: 30 }}>
          <button
            onClick={() => {
              setShowReviews(true);
              loadReviews();
            }}
            style={buttonStyle}
          >
            Показать рецензии
          </button>
        </div>
      )}

      {showReviews && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowReviews(false)} style={closeBtnStyle}>×</button>
            <h3>Рецензии</h3>
            {reviews.length === 0 ? (
                <p>Нет рецензий</p>
                ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {reviews.map((rev, idx) => (
                    <div key={idx} style={reviewStyle}>
                        <p><b>Оценка (Score):</b> {rev.score}</p>
                        <p><b>Рекомендация:</b> {rev.recommendation}</p>
                        <p><b>Техническое качество:</b> {rev.technicalMerit}</p>
                        <p><b>Оригинальность:</b> {rev.originality}</p>
                        <p><b>Качество презентации:</b> {rev.presentationQuality}</p>
                        <p><b>Комментарии для авторов:</b> {rev.commentsToAuthors}</p>
                        {/* Конфиденциальные комментарии можно скрыть или показывать по необходимости */}
                    </div>
                    ))}
                </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const closeBtnStyle = {
  position: 'absolute',
  right: 10,
  top: 10,
  background: 'transparent',
  border: 'none',
  fontSize: 20,
  cursor: 'pointer'
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  width: '400px',
  maxHeight: '80vh',
  overflow: 'auto',
  position: 'relative'
};

const reviewStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd'
};

export default PaperDetails;