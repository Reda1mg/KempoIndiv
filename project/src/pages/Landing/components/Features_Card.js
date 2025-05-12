import React from 'react';
import styles from './Features_Card.module.css';

const FeatureCard = ({ feature }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{feature.icon}</div>
      <h3 className={styles.title}>{feature.title}</h3>
      <p className={styles.description}>{feature.description}</p>
    </div>
  );
};

export default FeatureCard;
