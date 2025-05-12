import React from "react";
import styles from "./Filters.module.css";
import CreationTournoi from "./CreateTournament";

const Filters = ({
  searchQuery, setSearchQuery,
  searchQueryCity, setSearchQueryCity,
  searchQueryClub, setSearchQueryClub,
  selectedDate, setSelectedDate,
  userRole
}) => {
  const canCreate = userRole === "ADMIN" || userRole === "GESTIONNAIRE";

  return (
    <div className={styles.filtersContainer}>
      {/* Name */}
      <div className={styles.filterItem}>
        <label>🔎 Rechercher par nom :</label>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Nom du tournoi"
        />
      </div>

      {/* City */}
      <div className={styles.filterItem}>
        <label>🏙️ Filtrer par ville :</label>
        <input
          value={searchQueryCity}
          onChange={e => setSearchQueryCity(e.target.value)}
          placeholder="Ville"
        />
      </div>

      {/* Club */}
      <div className={styles.filterItem}>
        <label>🏫 Filtrer par club :</label>
        <input
          value={searchQueryClub}
          onChange={e => setSearchQueryClub(e.target.value)}
          placeholder="Club"
        />
      </div>

      {/* Date */}
      <div className={styles.filterItem}>
        <label>📅 Filtrer par date :</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Create */}
      {canCreate && (
        <div className={styles.createBtn}>
          <CreationTournoi />
        </div>
      )}
    </div>
  );
};

export default Filters;
