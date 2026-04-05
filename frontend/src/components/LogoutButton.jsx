import React from 'react';
import { globals } from '../data';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch(`${globals.baseUrl}/account/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      // Очистка localStorage (если использовался)
      localStorage.clear();

      // Перенаправление на страницу логина
      window.location.href = '/login';
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={buttonStyle}>
      Выйти
    </button>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  float: 'right'
};

export default LogoutButton;