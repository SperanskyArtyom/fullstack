import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { globals } from '../data';

function ReviewForm() {
  const { id, paperId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    score: 0,
    recommendation: '',
    technicalMerit: '',
    originality: '',
    presentationQuality: '',
    commentsToAuthors: '',
    confidentialCommentsToEditor: '',
    isDraft: true,
    paperId: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id && paperId) {
      setForm(prev => ({ ...prev, paperId }));
    }
  }, [paperId]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${globals.baseUrl}/api/reviewer/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки ревью');
        return res.json();
      })
      .then(data => {
        setForm({
          score: data.score,
          recommendation: data.recommendation,
          technicalMerit: data.technicalMerit,
          originality: data.originality,
          presentationQuality: data.presentationQuality,
          commentsToAuthors: data.commentsToAuthors,
          confidentialCommentsToEditor: data.confidentialCommentsToEditor,
          isDraft: data.isDraft === true || data.isDraft === 'true',
          paperId: data.paperId
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось загрузить ревью');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (
      form.score === '' ||
      form.recommendation.trim() === '' ||
      form.technicalMerit.trim() === '' ||
      form.originality.trim() === '' ||
      form.presentationQuality.trim() === '' ||
      form.commentsToAuthors.trim() === '' ||
      form.confidentialCommentsToEditor.trim() === ''
    ) {
      setError('Пожалуйста, заполните все поля.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e, sendFinal = false) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  const data = new FormData();
  data.append('Score', form.score);
  data.append('Recommendation', form.recommendation);
  data.append('TechnicalMerit', form.technicalMerit);
  data.append('Originality', form.originality);
  data.append('PresentationQuality', form.presentationQuality);
  data.append('CommentsToAuthors', form.commentsToAuthors);
  data.append('ConfidentialCommentsToEditor', form.confidentialCommentsToEditor);
  data.append('IsDraft', (sendFinal).toString());
  data.append('PaperId', form.paperId);

  try {
    // Если id есть — обновляем (PUT), иначе создаём (POST)
    const url = id
      ? `${globals.baseUrl}/api/reviewer/${id}`
      : `${globals.baseUrl}/api/reviewer/create`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      credentials: "include",
      body: data
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Ошибка сохранения ревью');
    }

    setLoading(false);
    navigate('/reviewerDashboard');
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

  if (loading) return <p>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/reviewerDashboard')} style={styles.backButton}>
        ← Назад
      </button>

      <h2 style={styles.heading}>{id ? 'Редактировать ревью' : 'Создать ревью'}</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form
        onSubmit={e => handleSubmit(e, false)}
        encType="multipart/form-data"
        style={styles.form}
      >
        <label style={styles.label}>
          Оценка (Score):
          <select
            name="score"
            value={form.score}
            onChange={handleChange}
            required
            style={styles.select}
          >
            {[0,1,2,3,4,5].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Рекомендация:
          <textarea
            name="recommendation"
            value={form.recommendation}
            onChange={handleChange}
            required
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.label}>
          Техническое качество:
          <textarea
            name="technicalMerit"
            value={form.technicalMerit}
            onChange={handleChange}
            required
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.label}>
          Оригинальность:
          <textarea
            name="originality"
            value={form.originality}
            onChange={handleChange}
            required
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.label}>
          Качество презентации:
          <textarea
            name="presentationQuality"
            value={form.presentationQuality}
            onChange={handleChange}
            required
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.label}>
          Комментарии для авторов:
          <textarea
            name="commentsToAuthors"
            value={form.commentsToAuthors}
            onChange={handleChange}
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.label}>
          Конфиденциальные комментарии для редактора:
          <textarea
            name="confidentialCommentsToEditor"
            value={form.confidentialCommentsToEditor}
            onChange={handleChange}
            rows={10}
            style={styles.largeTextarea}
          />
        </label>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isDraft"
            checked={form.isDraft}
            onChange={(e)=>{
              setForm(prev => ({
                  ...prev,
                  isDraft : e.target.checked
                }));
            }}
            style={{ marginRight: 8 }}
          />
          Сохранить как черновик
        </label>

        <div style={styles.buttonsWrapper}>
          <button
            type="button"
            onClick={e => handleSubmit(e, form.isDraft)}
            disabled={loading}
            style={{ ...styles.button, ...styles.submitButton }}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '40px auto',
    fontFamily: 'sans-serif',
    padding: '0 15px',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#007bff',
    fontSize: 16,
    cursor: 'pointer',
    marginBottom: 20,
  },
  heading: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  select: {
    marginTop: 6,
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: '100px',
  },
  largeTextarea: {
    marginTop: 6,
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
    resize: 'vertical',
    height: 300,
    minHeight: 300,
  },
  buttonsWrapper: {
    display: 'flex',
    gap: 12,
    marginTop: 10,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#28a745',
  }
};

export default ReviewForm;