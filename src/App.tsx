import { Routes, Route, Navigate } from "react-router-dom";
import GamesPage from "./pages/GamesPage";
import CreatePage from "./pages/CreatePage";
import FavoritesPage from "./pages/FavoritesPage";
import './App.css';
import NavigationBar from "./components/NavigationBar";
import { useAuth } from "./firebase/AuthProvider"; // Import useAuth

function App() {
  const { isAdmin } = useAuth(); // Get admin status

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/games" replace />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        
        {/* Directly conditionally render the admin route */}
        {isAdmin && <Route path="/create-game" element={<CreatePage />} />}
        
        {/* Redirect non-admin users if they try accessing /create-game */}
        {!isAdmin && <Route path="/create-game" element={<Navigate to="/games" replace />} />}
      </Routes>
    </>
  );
}

export default App;
