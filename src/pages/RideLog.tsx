import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { getDocs, collection, query, onSnapshot } from "firebase/firestore";
import { Navigation } from "@/components/Navigation";
import SideImages from "@/components/SideImages";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Drive {
  user: string;
  destination: string;
  kilometers: number;
  passengers: number;
  alcoholNights: boolean;
  points: number;
  date: string;
}

const RideLog = () => {
  const [rides, setRides] = useState<Drive[]>([]);
  const [leaderboardId, setLeaderboardId] = useState<string | null>(null);
  const [leaderboards, setLeaderboards] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const leaderboardQuery = query(collection(db, "leaderboards"));
    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      const fetchedLeaderboards = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setLeaderboards(fetchedLeaderboards);
      if (fetchedLeaderboards.length > 0) {
        setLeaderboardId(fetchedLeaderboards[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!leaderboardId) return;

    const fetchRides = async () => {
      if (!leaderboardId) return;

      const rideLogRef = collection(db, "leaderboards", leaderboardId, "rides");
      const rideLogSnap = await getDocs(rideLogRef);

      if (!rideLogSnap.empty) {
        const ridesData: Drive[] = rideLogSnap.docs.map((doc) => ({
          ...(doc.data() as Drive),
        }));
        setRides(ridesData);
      } else {
        setRides([]);
      }
    };

    fetchRides();
  }, [leaderboardId]);

  return (
    <div className="page-container">
      <Navigation />
      <SideImages />
      <div className="ride-log-content">
        <h1 className="ride-log-title">Ride History</h1>

        {/* Leaderboard Selector */}
        <div className="ride-log-selector">
          <label htmlFor="leaderboard" className="selector-label">Select Leaderboard:</label>
          <select
            id="leaderboard"
            className="selector-dropdown"
            value={leaderboardId || ""}
            onChange={(e) => setLeaderboardId(e.target.value)}
          >
            {leaderboards.map((lb) => (
              <option key={lb.id} value={lb.id}>
                {lb.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rides Table */}
        <div className="table-container">
          <Table className="styled-table">
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead className="text-center">🚗 Kilometers</TableHead>
                <TableHead className="text-center">🏆 Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.length > 0 ? (
                rides.map((ride, index) => (
                  <TableRow key={index} className="table-row">
                    <TableCell>{new Date(ride.date).toLocaleDateString()}</TableCell>
                    <TableCell>{ride.user}</TableCell>
                    <TableCell>{ride.destination}</TableCell>
                    <TableCell className="text-center">{ride.passengers}</TableCell>
                    <TableCell className="text-center">{ride.kilometers}</TableCell>
                    <TableCell className="text-center leaderboard-points">{ride.points}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="no-rides-message">
                    No rides recorded for this leaderboard.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RideLog;
