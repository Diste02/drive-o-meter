import React, { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, query, onSnapshot, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import "../index.css";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useNavigate } from "react-router-dom";

interface Drive {
  user: string;
  kilometers: number;
  passengers: number;
  alcoholNights: number;
  points: number;
}

interface Leaderboard {
  id: string;
  name: string;
  members: string[];
  drives: Drive[];
}

const LeaderboardComponent = ({ leaderboardId }: { leaderboardId: string }) => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<string[]>([]);
  const [isManageOpen, setIsManageOpen] = useState<{ [key: string]: boolean }>({});
  const [newMember, setNewMember] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const leaderboardQuery = query(collection(db, "leaderboards"));
    const unsubscribe = onSnapshot(leaderboardQuery, async (snapshot) => {
      const fetchedLeaderboards: Leaderboard[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const leaderboardData = doc.data() as Leaderboard;
          const leaderboardId = doc.id;

          const ridesRef = collection(db, "leaderboards", leaderboardId, "rides");
          const ridesSnap = await getDocs(ridesRef);
          const drives: Drive[] = ridesSnap.docs.map((rideDoc) => rideDoc.data() as Drive);

          return {
            id: leaderboardId,
            name: leaderboardData.name,
            members: leaderboardData.members || [],
            drives: drives || [],
          };
        })
      );

      setLeaderboards(fetchedLeaderboards);
    });

    return () => unsubscribe();
  }, []);

  const createLeaderboard = async () => {
    console.log("Create Leaderboard button clicked");

    if (!name.trim()) {
      console.error("Error: Leaderboard name is empty.");
      return;
    }
    if (drivers.length === 0) {
      console.error("Error: No drivers added.");
      return;
    }

    console.log("Creating leaderboard with name:", name);
    console.log("Drivers list:", drivers);

    try {
      const docRef = await addDoc(collection(db, "leaderboards"), {
        name,
        members: drivers,
        drives: []
      });
      console.log("Leaderboard Created:", docRef.id);
      closeModal();
      navigate(`/leaderboard`);
    } catch (error) {
      console.error("Error creating leaderboard:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setDrivers([]);
  };

  const addDriver = async (
    eventOrId: React.KeyboardEvent<HTMLInputElement> | string,
    driverName?: string
  ) => {
    let newDriver: string | undefined;

    if (typeof eventOrId === "string") {
      newDriver = driverName?.trim();
    } else {
      eventOrId.preventDefault();
      newDriver = eventOrId.currentTarget.value.trim();
      eventOrId.currentTarget.value = "";
    }

    if (!newDriver) return;

    if (typeof eventOrId === "string") {
      const leaderboardId = eventOrId;
      try {
        const leaderboardRef = doc(db, "leaderboards", leaderboardId);
        const leaderboard = leaderboards.find(lb => lb.id === leaderboardId);

        if (leaderboard && !leaderboard.members.includes(newDriver)) {
          await updateDoc(leaderboardRef, {
            members: [...leaderboard.members, newDriver],
          });
        }
      } catch (error) {
        console.error("Error adding driver to existing leaderboard:", error);
      }
    } else {
      if (!drivers.includes(newDriver)) {
        setDrivers([...drivers, newDriver]);
      }
    }
  };

  const removeDriver = async (participant: string, leaderboardId?: string) => {
    if (leaderboardId) {
      try {
        const leaderboardRef = doc(db, "leaderboards", leaderboardId);
        const leaderboard = leaderboards.find(lb => lb.id === leaderboardId);

        if (leaderboard) {
          const updatedMembers = leaderboard.members.filter(member => member !== participant);
          await updateDoc(leaderboardRef, { members: updatedMembers });
        }
      } catch (error) {
        console.error("Error removing participant:", error);
      }
    } else {
      setDrivers(drivers.filter(d => d !== participant));
    }
  };


  return (
    <div className="page-container">
      {/* Intestazione Classifica */}
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Classifica</h1>
        <p className="leaderboard-updated">Aggiornato: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="leaderboard-content">
        {leaderboards.length === 0 ? (
          <div className="leaderboard-empty">
            <p className="leaderboard-empty-text">Nessuna classifica trovata.</p>
            <p className="leaderboard-subtext">Crea una nuova classifica o unisciti a una esistente.</p>
            <div className="leaderboard-actions">
              <button className="button button-primary" onClick={() => setIsModalOpen(true)}>
                Crea Classifica
              </button>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <Table className="styled-table">
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead className="text-center">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">🚗 Chilometri</TableHead>
                  <TableHead className="text-center">🍺 Notti Alcoliche</TableHead>
                  <TableHead className="text-center">🏆 Punti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboards.map((leaderboard) => {
                  const driverStats: { [key: string]: { kilometers: number; points: number; alcoholNights: number } } = {};

                  leaderboard.drives.forEach((drive) => {
                    if (!driverStats[drive.user]) {
                      driverStats[drive.user] = { kilometers: 0, points: 0, alcoholNights: 0 };
                    }
                    driverStats[drive.user].kilometers += drive.kilometers;
                    driverStats[drive.user].points += drive.points;
                    driverStats[drive.user].alcoholNights += drive.alcoholNights;
                  });

                  leaderboard.members.forEach((member) => {
                    if (!driverStats[member]) {
                      driverStats[member] = { kilometers: 0, points: 0, alcoholNights: 0 };
                    }
                  });
                  const sortedDrivers = Object.entries(driverStats).sort((a, b) => b[1].points - a[1].points);

                  return (
                    <React.Fragment key={leaderboard.id}>
                      {sortedDrivers.map((drive, index) => (
                        <TableRow key={index} >
                          <TableCell className="rank">{index + 1}</TableCell>
                          <TableCell className="driver-name">{drive[0]}</TableCell>
                          <TableCell className="text-center">{drive[1].kilometers}</TableCell>
                          <TableCell className="text-center">{drive[1].alcoholNights}</TableCell>
                          <TableCell className="text-center leaderboard-points">{drive[1].points}</TableCell>
                        </TableRow>
                      ))}
                      {/* 🔹 AGGIUNGI IL PULSANTE GESTISCI MEMBRI QUI */}
                      <tr>
                        <td colSpan={5} className="text-center">
                          <button
                            onClick={() => setIsManageOpen((prev) => ({ ...prev, [leaderboard.id]: !prev[leaderboard.id] }))}
                            className="button button-secondary"
                          >
                            {isManageOpen[leaderboard.id] ? "Chiudi" : "Gestisci Membri"}
                          </button>
                        </td>
                      </tr>

                      {/* Sezione Gestione Membri */}
                      {isManageOpen[leaderboard.id] && (
                        <tr>
                          <td colSpan={5} className="manage-members">
                            <h3>Gestisci Membri</h3>

                            {/* Aggiungi Membro */}
                            <div className="add-member-container">
                              <input
                                type="text"
                                placeholder="Inserisci il nome di un nuovo membro"
                                value={newMember[leaderboard.id] || ""}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, [leaderboard.id]: e.target.value }))}
                                className="input-field"
                              />
                              <button onClick={() => addDriver(leaderboard.id, newMember[leaderboard.id])} className="button button-primary">
                                Aggiungi
                              </button>
                            </div>

                            {/* Elenco Membri */}
                            <ul className="member-list">
                              {leaderboard.members.map((member, index) => (
                                <li key={index} className="member-item">
                                  <span>{member}</span>
                                  <button className="remove-button" onClick={() => removeDriver(leaderboard.id, member)}>
                                    ❌
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modale per la creazione di una classifica */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Crea Nuova Classifica</h2>

            {/* Input Nome Classifica */}
            <label className="modal-label">Nome della Classifica</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Inserisci il nome della classifica"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Input Conducenti */}
            <label className="modal-label">Aggiungi Conducenti</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Inserisci il nome del conducente e premi Invio"
              onKeyDown={(e) => addDriver(e)}
            />

            {/* Elenco Conducenti Aggiunti */}
            <ul className="modal-driver-list">
              {drivers.map((driver) => (
                <li key={driver} className="modal-driver-item">
                  <span>{driver}</span>
                  <button className="modal-remove-driver" onClick={() => removeDriver(driver)}>✕</button>
                </li>
              ))}
            </ul>

            {/* Pulsanti Modale */}
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={closeModal}>Annulla</button>
              <button
                className={`modal-create ${name && drivers.length ? "active" : "disabled"}`}
                onClick={createLeaderboard}
                disabled={!name || drivers.length === 0}
              >
                Crea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardComponent;
