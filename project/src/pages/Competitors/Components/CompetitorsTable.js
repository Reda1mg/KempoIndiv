import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompetitorsTable.module.css";
import Filter from "./Filter";
import AjouterCompetiteurs from "./AddCompetitors";
import EditCompetitors from "./EditCompetitors";
import { jwtDecode } from "jwt-decode";

const CompetitorTable = () => {
  const [competitors, setCompetitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("❌ Invalid token:", err);
      }
    }

    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/competitors/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetitors(res.data);
      console.log("Competitors from backend:", res.data); // Optional: debug log
    } catch (error) {
      console.error("❌ Failed to fetch competitors:", error);
    }
  };

  const handleAdd = () => {
    fetchCompetitors(); // Re-fetch from server after adding
    setIsAddModalOpen(false);
  };

  const openEditModal = (competitor) => {
    setSelectedCompetitor(competitor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCompetitor(null);
  };

  const handleDelete = async (competitorId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce compétiteur ?")) return;
    try {
      await axios.delete(`http://localhost:3000/competitors/${competitorId}`);
      setCompetitors(prev => prev.filter(c => c.id !== competitorId));
      alert("✅ Compétiteur supprimé !");
    } catch (error) {
      console.error("❌ Erreur suppression :", error.response?.data || error.message);
      alert("Erreur lors de la suppression du compétiteur.");
    }
  };

  const filteredCompetitors = competitors.filter((c) => {
    if (!c || !c.firstname || !c.lastname) return false;

    const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || (c.birthday && c.birthday.startsWith(selectedDate));
    const matchesGrade = !selectedGrade || c.rank === selectedGrade;
    return matchesName && matchesDate && matchesGrade;
  });

  const canEdit = userRole === "ADMIN" || userRole === "GESTIONNAIRE";

  return (
    <div className={styles.container}>
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        userRole={userRole}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>🏆 Grade</th>
              <th>📅 Date de Naissance</th>
              <th>⚖️ Poids</th>
              {canEdit && <th>⚙️ Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstname} {c.lastname}</td>
                  <td>{c.rank}</td>
                  <td>{c.birthday ? new Date(c.birthday).toLocaleDateString() : "-"}</td>
                  <td>{c.weight ?? "-"}</td>
                  {canEdit && (
                    <td>
                      <button className={styles.btnEdit} onClick={() => openEditModal(c)}>✏️</button>
                      <button className={styles.btnDelete} onClick={() => handleDelete(c.id)}>🗑️</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canEdit ? 5 : 4}>Aucun compétiteur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AjouterCompetiteurs
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <EditCompetitors
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        competitor={selectedCompetitor}
        onSave={fetchCompetitors}
      />
    </div>
  );
};

export default CompetitorTable;
