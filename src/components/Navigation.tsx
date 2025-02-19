import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Home, Trophy, PlusCircle, ClipboardList, ScrollText } from "lucide-react";

export const Navigation = () => {
  const [leaderboards, setLeaderboards] = useState<{ id: string }[]>([]);

  useEffect(() => {
    const leaderboardQuery = query(collection(db, "leaderboards"));
    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      setLeaderboards(snapshot.docs.map((doc) => ({ id: doc.id })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="nav-bar">
      <div className="container nav-container">
        <div className="nav-content">
          {/* 🔹 Nome dell'App */}
          <Link to="/" className="nav-title">
            Chi Guida Stasera?
          </Link>

          {/* 🔹 Link di Navigazione */}
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <Home className="icon" />
              Home
            </Link>
            <Link to="/leaderboard" className="nav-link">
              <Trophy className="icon" />
              Classifica
            </Link>
            <Link to="/manage-points" className="nav-link">
              <PlusCircle className="icon" />
              Gestisci Punti
            </Link>
            <Link to="/ride-log" className="nav-link">
              <ClipboardList className="icon" />
              Registro Viaggi
            </Link>
            <Link to="/rules" className="nav-link">
              <ScrollText className="icon" />
              Regole
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};  