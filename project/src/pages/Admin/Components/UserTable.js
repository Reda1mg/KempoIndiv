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
  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Utilisateur supprimé !");
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
      alert("Erreur lors de la suppression.");
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
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ marginLeft: "8px", backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 8px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Supprimer
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
