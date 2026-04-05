import React, { useState, useEffect } from 'react';
import { globals } from '../data';

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
    let url = '';
    if (type === 'Author') url = `${globals.baseUrl}/api/author/profile`;
    else if (type === 'Reviewer') url = `${globals.baseUrl}/api/reviewer/profile`;

    if (url) {
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData(data);
        })
        .catch(console.error);
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const url = userType === 'Author'
      ? `${globals.baseUrl}/api/author/profile`
      : `${globals.baseUrl}/api/reviewer/profile`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const updated = await response.json();
      setProfile(updated);
      setFormData(updated);
      setEditMode(false);
    } else {
      alert('Ошибка при сохранении профиля');
    }
  };
   let specs = [
      "Medicine",
      "ComputerScience",
      "Common"
   ]    
  if (!profile) return <p>Загрузка профиля...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Профиль {userType === 'Author' ? 'автора' : 'рецензента'}</h2>

      {editMode ? (
        <div style={formStyle}>
          <label>ФИО:</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} />

          {userType === 'Author' && (
            <>
              <label>Локация:</label>
              <input name="location" value={formData.location} onChange={handleChange} />

              <label>Специализация:</label>
              <select name="fieldOfExpertise" value={specs[formData.fieldOfExpertise]} onChange={handleChange}>
                <option value="Medicine">Медицина</option>
                <option value="ComputerScience">Информатика</option>
                <option value="Common">Общая</option>
              </select>

              <label>Биография:</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} />

              <label>XLink:</label>
              <input name="xLink" value={formData.xLink} onChange={handleChange} />

              <label>LinkedIn:</label>
              <input name="linkeding" value={formData.linkeding} onChange={handleChange} />
            </>
          )}

          {userType === 'Reviewer' && (
            <>
              <label>Образование:</label>
              <input name="institution" value={formData.institution} onChange={handleChange} />

              <label>Специализация:</label>
              <select name="fieldOfExpertise" value={specs[formData.fieldOfExpertise]} onChange={handleChange}>
                <option value="Medicine">Медицина</option>
                <option value="ComputerScience">Информатика</option>
                <option value="Common">Общая</option>
              </select>
            </>
          )}

          <div style={{ marginTop: 10 }}>
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => setEditMode(false)} style={{ marginLeft: 10 }}>Отмена</button>
          </div>
        </div>
      ) : (
        <div style={{ lineHeight: '1.8' }}>
          <p><b>ФИО:</b> {profile.fullName}</p>
          <p><b>Email:</b> {profile.email}</p>
          
          {userType === 'Author' && (
            <>
              <p><b>Локация:</b> {profile.location}</p>
              <p><b>Специализация:</b> {profile.fieldOfExpertise}</p>
              <p><b>Биография:</b> {profile.bio}</p>
              <p><b>Ссылки:</b> <a href={profile.xLink}>XLink</a>, <a href={profile.linkeding}>LinkedIn</a></p>
            </>
          )}

          {userType === 'Reviewer' && (
            <>
              <p><b>Образование:</b> {profile.institution}</p>
              <p><b>Специализация:</b> {profile.fieldOfExpertise}</p>
            </>
          )}

          <button onClick={() => setEditMode(true)} style={{ marginTop: 10 }}>Редактировать</button>
        </div>
      )}
    </div>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  background: '#f9f9f9',
  padding: 20,
  borderRadius: 4,
  border: '1px solid #ddd'
};

export default ProfileTab;