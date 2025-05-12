import React from 'react';
import styles from './ChangeRoleModal.module.css';

const ChangeRoleModal = ({ isOpen, onClose, onConfirm, selectedUser }) => {
  const [newRole, setNewRole] = React.useState('');

  React.useEffect(() => {
    if (selectedUser) setNewRole(selectedUser.role);
  }, [selectedUser]);

  if (!isOpen || !selectedUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedUser.id, newRole);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Modifier le rôle de {selectedUser.username}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nouveau rôle :</label>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)} required>
            <option value="ADMIN">ADMIN</option>
            <option value="UTILISATEUR">UTILISATEUR</option>
            <option value="GESTIONNAIRE">GESTIONNAIRE</option>
            <option value="ARBITRE">ARBITRE</option>
          </select>
          <div className={styles.actions}>
            <button type="submit" className={styles.confirm}>Confirmer</button>
            <button type="button" onClick={onClose} className={styles.cancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
