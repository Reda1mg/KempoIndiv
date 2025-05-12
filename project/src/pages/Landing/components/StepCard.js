import React from 'react';
import styles from './StepCard.module.css';

const StepCard = ({ step }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        {step.icon}
      </div>
      <div className={styles.header}>
        <div className={styles.stepId}>{step.id}</div>
        <h3 className={styles.title}>{step.title}</h3>
      </div>
      <p className={styles.description}>{step.description}</p>
    </div>
  );
};

export default StepCard;
