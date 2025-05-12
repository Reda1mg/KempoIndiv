import React from "react";
import styles from './AdminUsers.module.css';

const AdminUsers = () => {
  const users = [
    { id: 1, name: "Jane Dupont", role: "Admin" },
    { id: 2, name: "Jean Martin", role: "Utilisateur" },
  ];

  return (
    <div className={styles.userWrapper}>
      <div className={styles.header}>
        <h2>Utilisateurs</h2>
        <button className={styles.createBtn}>Créer un Utilisateur</button>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button className={styles.editBtn}>Éditer</button>
                <button className={styles.deleteBtn}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
