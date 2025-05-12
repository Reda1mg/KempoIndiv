import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./nav.module.css";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload); // { id, role, username }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={style.sidebar}>
      <div className={style["user-info"]}>
        <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
        {user && (
          <div className={style["user-name"]}>
            👤 {user.username}
          </div>
        )}
      </div>

      <ul className={style.menu}>
        <Link to="/"><li>🏠 Accueil</li></Link>

        {!user && (
          <Link to="/login"><li>🔐 Connexion</li></Link>
        )}

        {user && (
          <>
            <Link to="/tournaments"><li>📺 Tournois</li></Link> 
            <Link to="/competiteurs"><li>👥 Compétiteurs</li></Link>

            {user.role === "ADMIN" && (
              <Link to="/admin"><li>🛠️ Admin</li></Link>
            )}

            <li
              onClick={handleLogout}
              style={{ cursor: "pointer", color: "#f55", marginTop: "10px" }}
            >
              🚪 Logout
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default NavBar;
