import { useParams, useNavigate } from "react-router-dom";
import LeaderboardComponent from "../components/Leaderboard";
import { Navigation } from "../components/Navigation";
import Roulette from "../components/Roulette";
import SideImages from "../components/SideImages";
import { useEffect, useState } from "react";

const Leaderboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  console.log("Leaderboard ID:", id);

  useEffect(() => {
    if (!id) {
      console.warn("No leaderboard ID provided, showing create modal...");
    }
    setLoading(false);
  }, [id]);

  return (
    <div className="page-container">
      <Navigation />
      <SideImages />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LeaderboardComponent leaderboardId={id ?? ""} />
        </>
      )}
      {/* <Roulette /> */}
    </div>
  );
};

export default Leaderboard;
