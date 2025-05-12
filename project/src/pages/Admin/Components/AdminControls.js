import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminControl.module.css';

const AdminControls = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.controls}>
      <div className={styles.controlCard}>
        <h2>Gérer les Utilisateurs</h2>
        <button onClick={() => navigate('/admin/utilisateurs')}>
          Gerer les Utilisateurs
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
