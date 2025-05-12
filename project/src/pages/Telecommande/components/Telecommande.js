import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Telecommande.module.css";

const Telecommande = () => {
  const { matchId } = useParams();
  const timerRef = useRef(null);

  const [competitor1, setCompetitor1] = useState({ id: 1, firstname: "", lastname: "", club: "" });
  const [competitor2, setCompetitor2] = useState({ id: 2, firstname: "", lastname: "", club: "" });
  const [score1, setScore1] = useState(() => +localStorage.getItem("score1") || 0);
  const [score2, setScore2] = useState(() => +localStorage.getItem("score2") || 0);
  const [faults1, setFaults1] = useState(() => +localStorage.getItem("faults1") || 0);
  const [faults2, setFaults2] = useState(() => +localStorage.getItem("faults2") || 0);
  const [time, setTime] = useState(() => +localStorage.getItem("time") || 180);
  const [matchRes, setMatchRes] = useState(localStorage.getItem('matchRes') ? localStorage.getItem('matchRes') : {});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchMatchAndCompetitors = async () => {
      try {
        const matchRes = await axios.get(`http://localhost:3000/tournaments/matches/${matchId}`);
        const { competitor1: comp1Id, competitor2: comp2Id } = matchRes.data;
        const [comp1Res, comp2Res] = await Promise.all([
          axios.get(`http://localhost:3000/competitors/${comp1Id}`),
          axios.get(`http://localhost:3000/competitors/${comp2Id}`),
        ]);
        setCompetitor1(comp1Res.data);
        setCompetitor2(comp2Res.data);
      } catch (err) {
        console.error("❌ Failed to fetch match or competitors:", err);
      }
    };
    fetchMatchAndCompetitors();
  }, [matchId]);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("score1", score1);
    localStorage.setItem("score2", score2);
    localStorage.setItem("faults1", faults1);
    localStorage.setItem("faults2", faults2);
    localStorage.setItem("time", time);
    localStorage.setItem("matchRes", matchRes);
  }, [score1, score2, faults1, faults2, time, matchRes]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (time > 0) setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setScore1(0);
    setScore2(0);
    setFaults1(0);
    setFaults2(0);
    setTime(180);
    localStorage.clear();
  };

  const handleEnd = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTime(0);

    const winner = score1 > score2 ? competitor1.id : competitor2.id;
    const loser = score1 > score2 ? competitor2.id : competitor1.id;

    const result = {
      competitor1: { id: competitor1.id, score: score1, faults: faults1 },
      competitor2: { id: competitor2.id, score: score2, faults: faults2 },
      winner,
      loser,
    };

    setMatchRes(result)
    localStorage.clear();
  };

  const applyFaute = (setScore, competitor_num) => {
    setScore((prev) => Math.max(0, prev - 2));
    if (competitor_num === 1) setFaults1((f) => f + 1);
    else setFaults2((f) => f + 1);
  };

  const downloadMatchResultCSV = (obj) => {
    if(!obj.competitor1){
      alert('Pas de données à télécharger !')
    }
    const headers = ['Competitor ID', 'Score', 'Faults', 'Role'];
    const rows = [
      [obj.competitor1.id, obj.competitor1.score, obj.competitor1.faults, obj.winner === obj.competitor1.id ? 'Winner' : 'Loser'],
      [obj.competitor2.id, obj.competitor2.score, obj.competitor2.faults, obj.winner === obj.competitor2.id ? 'Winner' : 'Loser'],
    ];
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'match_result.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      {/* Competitor 1 */}
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>{competitor1.firstname} {competitor1.lastname}</strong>
          <span>{competitor1.club}</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => setScore1((s) => Math.max(0, s - 1))}>-</button>
          <div className={styles.score}>{score1}</div>
          <button className={styles.btn} onClick={() => setScore1((s) => s + 1)}>+</button>
          <button className={styles.faute} onClick={() => applyFaute(setScore1, 1)}>Faute</button>
        </div>
      </div>

      {/* Competitor 2 */}
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>{competitor2.firstname} {competitor2.lastname}</strong>
          <span>{competitor2.club}</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => setScore2((s) => Math.max(0, s - 1))}>-</button>
          <div className={styles.score}>{score2}</div>
          <button className={styles.btn} onClick={() => setScore2((s) => s + 1)}>+</button>
          <button className={styles.faute} onClick={() => applyFaute(setScore2, 2)}>Faute</button>
        </div>
      </div>

      {/* Timer */}
      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.timerControls}>
          <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button>
          <button className={`${styles.ctrlBtn} ${styles.start}`} onClick={handleStart}>START</button>
          <button className={`${styles.ctrlBtn} ${styles.pause}`} onClick={handlePause}>PAUSE</button>
          <button className={`${styles.ctrlBtn} ${styles.reset}`} onClick={handleReset}>RESET</button>
          <button className={`${styles.ctrlBtn} ${styles.end}`} onClick={handleEnd}>END</button>
          <button className={`${styles.ctrlBtn} ${styles.download_csv}`} onClick={()=> downloadMatchResultCSV(matchRes)}>Download</button>
        </div>
      </div>
    </div>
  );
};

export default Telecommande;
