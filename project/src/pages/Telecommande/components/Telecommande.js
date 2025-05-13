import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import jsPDF from "jspdf";
import styles from "./Telecommande.module.css";

const socket = io("http://localhost:3010");

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
  const [matchRes, setMatchRes] = useState(() => {
    try {
      const stored = localStorage.getItem('matchRes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
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
        setTime((prev) => {
          const next = prev - 1;
          socket.emit("updateMatch", {
            matchId,
            score1,
            score2,
            keikuka1: faults1,
            keikuka2: faults2,
            time: next,
            isRunning: true
          });
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    socket.emit("updateMatch", {
      matchId,
      score1,
      score2,
      keikuka1: faults1,
      keikuka2: faults2,
      time,
      isRunning
    });
    localStorage.setItem("score1", score1);
    localStorage.setItem("score2", score2);
    localStorage.setItem("faults1", faults1);
    localStorage.setItem("faults2", faults2);
    localStorage.setItem("time", time);
    localStorage.setItem("matchRes", JSON.stringify(matchRes));
  }, [score1, score2, faults1, faults2, time, matchRes, isRunning]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
      window.open(`/scoreboard/${matchId}`, "_blank");
    }
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

    setMatchRes(result);
    localStorage.setItem("matchRes", JSON.stringify(result));
  };

  const applyFaute = (setScore, competitor_num) => {
    setScore((prev) => Math.max(0, prev - 2));
    if (competitor_num === 1) setFaults1((f) => f + 1);
    else setFaults2((f) => f + 1);
  };

  const downloadPDF = () => {
    if (!matchRes.competitor1) {
      alert("Pas de données à télécharger !");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Résultat du Match", 20, 20);

    doc.setFontSize(12);
    doc.text(`Joueur 1: ${competitor1.firstname} ${competitor1.lastname}`, 20, 40);
    doc.text(`Score: ${matchRes.competitor1.score}`, 20, 50);
    doc.text(`Fautes: ${matchRes.competitor1.faults}`, 20, 60);

    doc.text(`Joueur 2: ${competitor2.firstname} ${competitor2.lastname}`, 20, 80);
    doc.text(`Score: ${matchRes.competitor2.score}`, 20, 90);
    doc.text(`Fautes: ${matchRes.competitor2.faults}`, 20, 100);

    const winnerName = matchRes.winner === competitor1.id
      ? `${competitor1.firstname} ${competitor1.lastname}`
      : `${competitor2.firstname} ${competitor2.lastname}`;

    doc.setFontSize(14);
    doc.text(`🏆 Gagnant: ${winnerName}`, 20, 120);

    doc.save("match_result.pdf");
  };

  return (
    <div className={styles.container}>
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

      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.timerControls}>
          {/* <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button> */}
          <button className={`${styles.ctrlBtn} ${styles.start}`} onClick={handleStart}>COMMENCER</button>
          <button className={`${styles.ctrlBtn} ${styles.pause}`} onClick={handlePause}>PAUSE</button>
          <button className={`${styles.ctrlBtn} ${styles.reset}`} onClick={handleReset}>RESET</button>
          <button className={`${styles.ctrlBtn} ${styles.end}`} onClick={handleEnd}>Terminer</button>
          <button className={`${styles.ctrlBtn} ${styles.download_csv}`} onClick={downloadPDF}>TELECHARGER</button>
        </div>
      </div>
    </div>
  );
};

export default Telecommande;