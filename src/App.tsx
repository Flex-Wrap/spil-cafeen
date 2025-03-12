import { Routes, Route, Navigate } from "react-router-dom";
import GamesPage from "./pages/GamesPage";
import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import './App.css'
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <>
    <NavigationBar/>
    <Routes>
      <Route path="/" element={<Navigate to="/games" replace />} />
      <Route path="/games" element={<GamesPage />} />  {/* Homepage */}
      <Route path="/create-game" element={<CreatePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
    </>
  );
}

export default App;

