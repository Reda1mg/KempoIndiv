import React, { useState } from 'react';
import styles from './UsersModal.module.css';

const UsersModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [username, setUsername] = useState(initialData.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData.role || 'user');

  const handleSubmit = () => {
    if (!username || (!initialData.id && !password) || !role) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onSubmit({
      ...initialData,
      username,
      password: password || undefined,
      role
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{initialData.id ? "Modifier Utilisateur" : "Créer Utilisateur"}</h2>

        <label>Nom d'utilisateur :</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        {!initialData.id && (
          <>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </>
        )}

        <label>Rôle :</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="visitor">Visitor</option>
        </select>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            {initialData.id ? "Modifier" : "Créer"}
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
