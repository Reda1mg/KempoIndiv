import React from "react";
import RegisterForm from "./Components/RegisterForm";
import styles from "./Register.module.css"; // Optional for page-level styles

const Register = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inscription</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
