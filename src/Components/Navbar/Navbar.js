import React from 'react';
import styles from './Navbar.module.css';
import { FaHome, FaUsers, FaGamepad, FaTable, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/logo192.png" alt="Logo" />
        <p>NX MASTER TOURNAMENT</p>
      </div>
      <ul className={styles.menu}>
        <li><FaHome /><span>Accueil</span></li>
        <li><FaUsers /><span>Compétiteurs</span></li>
        <li><FaGamepad /><span>Telecommande</span></li>
        <li><FaTable /><span>Scoarboard</span></li>
        <li><FaSignInAlt /><span>Connexion</span></li>
      </ul>
    </div>
  );
};

export default Navbar;
