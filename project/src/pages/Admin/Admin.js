import React from 'react';

import UserTable from './Components/UserTable';

const Admin = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        marginLeft: '100px', // adjust based on sidebar width
        boxSizing: 'border-box',
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Tableau de Bord Admin
      </h1>
      {/* <AdminControls /> */}
      <UserTable />
    </div>
  );
};

export default Admin;
