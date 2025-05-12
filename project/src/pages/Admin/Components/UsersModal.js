import React, { useState, useEffect } from 'react';
import styles from './UserTable.module.css';
import axios from 'axios';
import UsersModal from './UsersModal'; // ✅ Ensure the path is correct

const UserModal = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleEditClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCreateUserClick = () => {
    setSelectedUser(null); // null means "create" mode
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    const token = localStorage.getItem("token");

    try {
      if (data.id) {
        // Update role
        await axios.put(`http://localhost:3001/users/${data.id}/role`, {
          role: data.role
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(prev =>
          prev.map(u => u.id === data.id ? { ...u, role: data.role } : u)
        );
      } else {
        // Create user
        await axios.post("http://localhost:3001/register", {
          username: data.username,
          password: data.password,
          role: data.role,
          email: data.email || null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchUsers(); // Refresh the list
      }

      setModalOpen(false);
    } catch (err) {
      console.error("❌ Failed to save user:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.header}>
  <h2>Utilisateurs Récents</h2>
  <button className={styles.createBtn} onClick={handleCreateUserClick}>
    ➕ Créer un utilisateur
  </button>
</div>


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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email || '-'}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => handleRoleEditClick(user)}
                >
                  Modifier le rôle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UsersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UserModal;
