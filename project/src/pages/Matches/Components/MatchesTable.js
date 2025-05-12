import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./MatchesTable.module.css";

const MatchesTable = () => {
  const { categoryId } = useParams();
  const [matches, setMatches] = useState([]);
  const [competitors, setCompetitors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/tournaments/categories/${categoryId}/not-finished-matches`
        );
        setMatches(res.data);

        const uniqueIds = Array.from(
          new Set(res.data.flatMap((m) => [m.competitor1, m.competitor2]))
        );

        uniqueIds.forEach((id) => {
          fetchCompetitor(id);
        });
      } catch (error) {
        console.error("Erreur chargement des matchs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [categoryId]);

  const fetchCompetitor = async (id) => {
    if (competitors[id]) return competitors[id];

    try {
      const res = await axios.get(`http://localhost:3000/competitors/${id}`);
      const name = `${res.data.firstname} ${res.data.lastname}`;
      setCompetitors((prev) => ({ ...prev, [id]: name }));
      return name;
    } catch (err) {
      console.error(`Erreur chargement du compétiteur ${id} :`, err);
      return id;
    }
  };

  const handleStartMatch = (matchId) => {
    const baseUrl = window.location.origin;

    // Open only the telecommande view
    const telecommandeWindow = window.open(
      `${baseUrl}/telecommande/${matchId}`,
      "_blank"
    );

    if (!telecommandeWindow) {
      alert("Veuillez autoriser les popups dans votre navigateur.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Matchs non terminés</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : matches.length === 0 ? (
        <p>Aucun match à afficher.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Compétiteur 1</th>
              <th>Compétiteur 2</th>
              <th>Score 1</th>
              <th>Score 2</th>
              <th>Gagnant</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id}>
                <td>{competitors[m.competitor1] || m.competitor1}</td>
                <td>{competitors[m.competitor2] || m.competitor2}</td>
                <td>{m.score1}</td>
                <td>{m.score2}</td>
                <td>{m.winner || "-"}</td>
                <td>
                  <button
                    className={styles.scoreboardButton}
                    onClick={() => handleStartMatch(m.id)}
                  >
                    Commencer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MatchesTable;
