import React from "react";
import LoginForm from "./Components/LoginForm"; // ✅ adjust the path if needed

const Login = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
      <LoginForm />
    </div>
  );
};

export default Login;
