import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "../utils/firebaseConfig";
import { collection, doc, updateDoc, getDoc, query, onSnapshot, addDoc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import SideImages from "@/components/SideImages";

const ManagePoints = () => {
  const [leaderboardId, setLeaderboardId] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [destination, setDestination] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [participants, setParticipants] = useState("");
  const [isAlcoholicNight, setIsAlcoholicNight] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  useEffect(() => {
    const leaderboardQuery = query(collection(db, "leaderboards"));
    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      if (!snapshot.empty) {
        const firstLeaderboard = snapshot.docs[0];
        setLeaderboardId(firstLeaderboard.id);
        setDrivers(firstLeaderboard.data().members || []);
      }
    });

    return () => unsubscribe();
  }, [leaderboardId]);

  const calculatePoints = (kilometers: number, passengers: number, isAlcoholicNight: boolean) => {
    let points = kilometers / 5;
    points += isAlcoholicNight ? 10 : 5;
    points += passengers;
    return Math.round(points);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderboardId || !destination || !selectedDriver || !kilometers || !participants) return;

    const km = parseFloat(kilometers);
    const numPassengers = parseInt(participants);
    const totalPoints = calculatePoints(km, numPassengers, isAlcoholicNight);

    const newDrive = {
      user: selectedDriver,
      destination,
      kilometers: km,
      passengers: numPassengers,
      alcoholNights: isAlcoholicNight ? 1 : 0,
      points: totalPoints,
      date,
    };

    try {
      const leaderboardRef = doc(db, "leaderboards", leaderboardId);
      const ridesCollectionRef = collection(leaderboardRef, "rides");
      const driverRef = doc(leaderboardRef, "members", selectedDriver);

      await addDoc(ridesCollectionRef, newDrive);

      const driverSnap = await getDoc(driverRef);
      if (driverSnap.exists()) {
        const driverData = driverSnap.data();
        await updateDoc(driverRef, {
          totalKilometers: (driverData.totalKilometers || 0) + newDrive.kilometers,
          totalPoints: (driverData.totalPoints || 0) + newDrive.points,
        });
      } else {
        console.warn("Driver not found in members subcollection.");
      }

      console.log("Showing toast...");
      toast({
        title: "Drive Added",
        description: `Added ${kilometers} km for ${selectedDriver}. Earned ${totalPoints} points!`,
        duration: 5000,
      });

      console.log("Resetting fields...");
      setDestination("");
      setKilometers("");
      setParticipants("");
      setSelectedDriver("");
      setIsAlcoholicNight(false);
      setDate(new Date().toISOString().split("T")[0]);

    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  return (
    <div className="page-container">
      <Navigation />
      <SideImages />
      <div className="manage-points-content">
        <Card className="points-card">
          <CardHeader>
            <CardTitle className="points-title">Add Driving Points</CardTitle>
            <p className="points-subtitle">Record new kilometers driven and update the leaderboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <Label htmlFor="driver">Driver Name</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" className="selector-label" />
                  </SelectTrigger>
                  <SelectContent className="selector-dropdown">
                    {drivers.map((driver) => (
                      <SelectItem key={driver} value={driver}>
                        {driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Enter the Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <Label htmlFor="kilometers">Kilometers Driven</Label>
                <Input
                  id="kilometers"
                  type="number"
                  placeholder="Enter kilometers"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <Label htmlFor="participants">Number of Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="How many people were in the car?"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  required
                />
              </div>
              <div className="form-checkbox">
                <Checkbox id="alcoholic-night" checked={isAlcoholicNight} onCheckedChange={(checked) => setIsAlcoholicNight(checked as boolean)} />
                <Label htmlFor="alcoholic-night" className="checkbox-label">
                  Alcoholic Night
                </Label>
              </div>
              <Button type="submit" className="submit-button">
                Add Points
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagePoints;
