import React, { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Checkbox } from "@/components/ui/checkbox";

const Roulette = () => {
  const [showFullRoulette, setShowFullRoulette] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<string[]>([
    "Diste", "Bob", "Alibbe", "Coppo", "Dangi", "Mox", "Pesche", "Puglie", "Rove", "Stocco", "Varist", "Sam"
  ]);

  const toggleDriverSelection = (driver: string) => {
    setSelectedDrivers((prevSelected) =>
      prevSelected.includes(driver)
        ? prevSelected.filter((d) => d !== driver)
        : [...prevSelected, driver]
    );
  };

  const spinWheel = () => {
    let randomRotation = Math.floor(500 + Math.random() * 1500);
    let currentRotation = 0;
    let interval = 30;
    let slowdownFactor = 0.98;

    const spinInterval = setInterval(() => {
      randomRotation *= slowdownFactor;
      currentRotation += randomRotation;

      if (randomRotation < 5) {
        clearInterval(spinInterval);
        const index = Math.floor(Math.random() * selectedDrivers.length);
        setSelected(selectedDrivers[index]);
      }

      setRotation(currentRotation);
    }, interval);
  };

  const closeModal = () => {
    document.querySelector(".roulette-modal")?.classList.add("closing");
    setTimeout(() => setShowFullRoulette(false), 300);
  };

  const colors = ["#ffeb3b", "#ff9800", "#f44336", "#4caf50", "#2196f3", "#9c27b0", "#3f51b5", "#00bcd4"];

  return (
    <>
      {!showFullRoulette && (
        <motion.div
          className="roulette-button"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFullRoulette(true)}
        >
          🎡
        </motion.div>
      )}

      {showFullRoulette && (
        <div className="roulette-modal">
          <div className="driver-selection">
            <label>Select Drivers for Roulette:</label>
            <div className="driver-checkboxes">
              {drivers.map((driver) => (
                <div key={driver} className="driver-checkbox">
                  <Checkbox
                    id={driver}
                    checked={selectedDrivers.includes(driver)}
                    onCheckedChange={() => toggleDriverSelection(driver)}
                  />
                  <label htmlFor={driver}>{driver}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Roulette Wheel */}
          <div className="wheel-container">
            <motion.div
              className="roulette-wheel"
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {selectedDrivers.length > 0 &&
                selectedDrivers.map((name, i) => {
                  const sliceAngle = 360 / selectedDrivers.length;
                  const rotation = i * sliceAngle;

                  return (
                    <div
                      key={i}
                      className="wheel-section"
                      style={{
                        backgroundColor: colors[i % colors.length],
                        transform: `rotate(${rotation}deg)`,
                        clipPath: `polygon(50% 50%, 100% 0, 100% 100%)`,
                      }}
                    >
                      <span
                        style={{
                          transform: `rotate(${sliceAngle / 2}deg)`,
                          position: "absolute",
                          top: "10%",
                          left: "50%",
                          transformOrigin: "center",
                          textAlign: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "white",
                          writingMode: "vertical-rl",
                          textOrientation: "upright",
                        }}
                      >
                        {name}
                      </span>
                    </div>
                  );
                })}
            </motion.div>
          </div>

          <button
            onClick={selectedDrivers.length > 0 ? spinWheel : undefined}
            className={`spin-button ${selectedDrivers.length === 0 ? "disabled" : ""}`}
            disabled={selectedDrivers.length === 0}
          >
            Spin!
          </button>
          {selected && (
            <>
              <Confetti />
              <p>🎆 {selected} will drive tonight! 🎇</p>
            </>
          )}
          <button onClick={closeModal} className="close-button">
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Roulette;
