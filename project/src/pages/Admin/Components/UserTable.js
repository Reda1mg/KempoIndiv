import React, { useEffect, useState } from 'react';
import styles from './UserTable.module.css';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur de récupération des utilisateurs:', error);
      alert('❌ Impossible de récupérer les utilisateurs.');
    }
  };

  const handleChangeRole = async (userId) => {
    const newRole = prompt("Entrez le nouveau rôle (ADMIN, UTILISATEUR, GESTIONNAIRE, etc.):");
    if (!newRole) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Rôle mis à jour !");
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Erreur mise à jour du rôle:", err);
      alert("❌ Impossible de modifier le rôle.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.tableSection}>
      <h2>Utilisateurs Récents</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email || '-'}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleChangeRole(user.id)}>
                    Modifier le rôle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Aucun utilisateur trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
