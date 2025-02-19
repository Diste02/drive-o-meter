import { Navigation } from "@/components/Navigation";
import SideImages from "@/components/SideImages";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Homepage = () => {
  return (
    <div className="page-container">
      <Navigation />
      <SideImages />

      <div className="container mx-auto px-4 py-24">
        {/* Sezione Hero */}
        <div className="max-w-2xl mx-auto text-center space-y-10 animate-fade-in">
          <h1 className="home-title">
            Benvenuto su
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-800">
              {" "}
              Drive-O-Meter
            </span>
          </h1>
          <p className="home-subtext">
            Tieni traccia dei punti di guida e gestisci chi guiderà la prossima volta.
            <br />
            Un sistema a punti <strong>equo e trasparente</strong> per condividere le responsabilità di guida.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex items-center justify-center gap-6 pt-10">
          <Link to="/leaderboard" className="button button-primary flex items-center">
            Visualizza Classifica
            <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
          </Link>

          <Link to="/manage-points" className="button button-secondary">
            Gestisci Punti
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
