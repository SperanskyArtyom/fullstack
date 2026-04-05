import React, { useState } from 'react';
import { globals } from '../data';
const categories = ['Medicine', 'Technology', 'Common'];

function CreatePaper() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: categories[0],
    tags: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('Title', formData.title);
    data.append('Content', formData.content);
    data.append('Category', formData.category);
    data.append('Tags', formData.tags);
    if (formData.image) {
      data.append('Image', formData.image);
    }

    try {
      const response = await fetch(`${globals.baseUrl}/api/papers`, {
        method: 'POST',
        credentials: "include",
        body: data
      });
      if (!response.ok) {
        const err = await response.text();
        setError(err || 'Ошибка при сохранении статьи');
        return;
      }
      setSuccess('Статья успешно создана!');
      setFormData({
        title: '',
        content: '',
        category: categories[0],
        tags: '',
        image: null
      });
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Создать статью</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="title"
          placeholder="Заголовок"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <textarea
          name="content"
          placeholder="Содержание"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          name="tags"
          placeholder="Теги через запятую"
          value={formData.tags}
          onChange={handleChange}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" style={{ padding: '12px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Создать
        </button>
      </form>
    </div>
  );
}

export default CreatePaper;