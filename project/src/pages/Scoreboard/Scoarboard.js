import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Scoreboard.module.css";

const Scoreboard = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [competitor1, setCompetitor1] = useState(null);
  const [competitor2, setCompetitor2] = useState(null);

  useEffect(() => {
    const fetchMatchAndCompetitors = async () => {
      try {
        const matchUrl = `http://localhost:3000/tournaments/matches/${matchId}`;
        console.log("📦 Fetching match from:", matchUrl);

        const matchRes = await axios.get(matchUrl);
        const matchData = matchRes.data;
        setMatch(matchData);

        const comp1Id = matchData.competitor1;
        const comp2Id = matchData.competitor2;

        const [comp1Res, comp2Res] = await Promise.all([
          axios.get(`http://localhost:3000/competitors/${comp1Id}`),
          axios.get(`http://localhost:3000/competitors/${comp2Id}`)
        ]);

        setCompetitor1(comp1Res.data);
        setCompetitor2(comp2Res.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchMatchAndCompetitors();
  }, [matchId]);

  if (!match || !competitor1 || !competitor2) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={styles.scoreboard}>
      <div className={`${styles.player} ${styles.red}`}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong>{competitor1.firstname} {competitor1.lastname.toUpperCase()}</strong>
            <span>{competitor1.club}</span>
          </div>
        </div>
        <div className={styles.score}>{match.score1}</div>
      </div>

      <div className={`${styles.player} ${styles.white}`}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong>{competitor2.firstname} {competitor2.lastname.toUpperCase()}</strong>
            <span>{competitor2.club}</span>
          </div>
        </div>
        <div className={styles.score}>{match.score2}</div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.logo}>
          <div className={styles.symbol}></div>
          <div className={styles.text}>
            <strong>NIPPON KEMPO</strong>
            <span>日本拳法</span>
          </div>
        </div>
        <div className={styles.timer}>03:00</div>
      </div>
    </div>
  );
};

export default Scoreboard;
