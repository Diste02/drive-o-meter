import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import ManagePoints from "./pages/ManagePoints.tsx";
import NotFound from "./pages/NotFound.tsx";
import RideLog from "./pages/RideLog.tsx";
import Rules from "./pages/Rules.tsx";
import "./index.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/manage-points" element={<ManagePoints />} />
          <Route path="/ride-log" element={<RideLog />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
