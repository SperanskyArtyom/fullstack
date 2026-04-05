import React, { useEffect, useState } from 'react';
import ProfileTab from './ProfileTab';
import MyPapers from './MyPapers';
import CreatePaper from './CreatePaper';
import LogoutButton from './LogoutButton';

function Dashboard() {
  const [state, setState] = useState(0);

  const tabs = [
    { name: 'Профиль', component: <ProfileTab /> },
    { name: 'Мои статьи', component: <MyPapers /> },
    { name: 'Отправить статью', component: <CreatePaper /> }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Дашборд</h2>
        <LogoutButton />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setState(index)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              background: state === index ? '#007bff' : '#f9f9f9',
              color: state === index ? '#fff' : '#000',
              cursor: 'pointer',
              borderRadius: 4
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #eee', padding: 20, borderRadius: 4 }}>
        {tabs[state].component}
      </div>
    </div>
  );
}

export default Dashboard;