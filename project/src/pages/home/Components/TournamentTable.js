import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./TournamentTable.module.css";
import Filter from "./Filters";
import EditTournoiModal from "./EditTournamentModal";
import { jwtDecode } from "jwt-decode";

const TournoiTable = () => {
  const [searchQueryName, setSearchQueryName] = useState("");
  const [searchQueryCity, setSearchQueryCity] = useState("");
  const [searchQueryClub, setSearchQueryClub] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournoi, setSelectedTournoi] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        const id = decoded.id || decoded.user?.id;
        setUserRole(role);
        setUserId(id);
        fetchTournaments(id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const fetchTournaments = (uid) => {
    fetch("http://localhost:3001/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: uid }),
    })
      .then(res => res.json())
      .then(data => {
        setTournois(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredTournois = tournois.filter(t =>
    t.name.toLowerCase().includes(searchQueryName.toLowerCase()) &&
    t.city.toLowerCase().includes(searchQueryCity.toLowerCase()) &&
    t.club.toLowerCase().includes(searchQueryClub.toLowerCase()) &&
    (selectedDate === "" || t.start_date.startsWith(selectedDate))
  );

  const handleDelete = async id => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tournoi ?")) return;
    const res = await fetch(`http://localhost:3001/tournament/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 202) {
      setTournois(ts => ts.filter(t => t.id !== id));
    } else {
      alert("❌ Impossible de supprimer (introuvable ou non autorisé).");
    }
  };

  const canEdit = userRole === "ADMIN" || userRole === "GESTIONNAIRE";

  return (
    <div className={styles["table-container"]}>
      <Filter
        searchQuery={searchQueryName}
        setSearchQuery={setSearchQueryName}
        searchQueryCity={searchQueryCity}
        setSearchQueryCity={setSearchQueryCity}
        searchQueryClub={searchQueryClub}
        setSearchQueryClub={setSearchQueryClub}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        userRole={userRole}
      />

      {loading ? (
        <p>Chargement des tournois…</p>
      ) : (
        <table className={styles["tournament-table"]}>
          <thead>
            <tr>
              <th>🏆 Nom</th>
              <th>📅 Date</th>
              <th>🏫 Club</th>
              <th>📍 Ville</th>
              {canEdit && <th>🔍 Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTournois.length > 0 ? (
              filteredTournois.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.start_date.split("T")[0]}</td>
                  <td>{t.club}</td>
                  <td>{t.city}</td>
                  {canEdit && (
                    <td className={styles["action-buttons"]}>
                      <button
                        className={styles["edit-btn"]}
                        onClick={() => {
                          setSelectedTournoi(t);
                          setEditOpen(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className={styles["delete-btn"]}
                        onClick={() => handleDelete(t.id)}
                      >
                        Supprimer
                      </button>
                      <Link to={`/tournoiDetails/${t.id}`}>
                        <button className={styles["details-btn"]}>Voir Détails</button>
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canEdit ? 5 : 4}>Aucun tournoi trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <EditTournoiModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        tournament={selectedTournoi}
        onUpdate={() => fetchTournaments(userId)}
      />
    </div>
  );
};

export default TournoiTable;
