import React, { useState } from 'react';
import { globals } from '../data';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setUserType }) {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch(`${globals.baseUrl}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      const types = [
        "Author",
        "Reviewer",
        "Admin"
      ]
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', types[Number(data.type)]);
      localStorage.setItem('email', data.email);
      if (Number(data.type) == 2) navigate('/dashboardAdmin')
      if (Number(data.type) == 0) navigate('/dashboard')
      if (Number(data.type) == 1) navigate('/reviewerDashboard')


    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Вход</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Войти</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Нет аккаунта?{' '}
        <button onClick={() => navigate('/register')} style={styles.linkButton}>
          Зарегистрироваться
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: '300px',
    margin: '100px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily: 'sans-serif'
  },
  title: {
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  linkButton: {
    background: 'none',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px'
  },
  error: {
    color: 'red'
  }
};

export default LoginForm;