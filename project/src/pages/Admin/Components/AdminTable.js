import React from 'react';
import styles from './AdminTable.module.css';

const AdminTable = () => {
  return (
    <div className={styles.tableSection}>
      <h2>Utilisateurs Récents</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Dupont</td>
            <td>jane@example.com</td>
            <td>Admin</td>
          </tr>
          <tr>
            <td>Jean Martin</td>
            <td>jean@example.com</td>
            <td>Utilisateur</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
