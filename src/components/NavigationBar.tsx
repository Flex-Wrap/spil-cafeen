import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../firebase/AuthProvider";
import "./styles/NavigationBar.css";
import logo from "../assets/spil-cafeen-logo.png"; // Import the logo

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, login, logout } = useAuth(); // Get user & admin status

  const handleLogin = async () => {
    try {
      await login();  // Wait for login to complete
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <div className="nav-content">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Spilcafeen Logo" className="nav-logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="nav-links">
            <NavLink to="/games">GAMES</NavLink>
            {isAdmin && <NavLink to="/create-game">CREATE</NavLink>}
            {user && <NavLink to="/favorites">FAVORITES</NavLink>}
            {user ? (
              <NavLink to="#" onClick={logout}>LOG OUT</NavLink> 
            ) : (
              <NavLink to="#" onClick={handleLogin}>LOG IN</NavLink> 
            )}
          </div>

          <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-links">
            <NavLink to="/games" onClick={() => setIsOpen(false)}>GAMES</NavLink>
            {isAdmin && <NavLink to="/create-game" onClick={() => setIsOpen(false)}>CREATE</NavLink>}
            {user && <NavLink to="/favorites" onClick={() => setIsOpen(false)}>FAVORITES</NavLink>}
            {user ? (
              <NavLink to="#" onClick={() => { logout(); setIsOpen(false); }}>LOG OUT</NavLink>
            ) : (
              <NavLink to="#" onClick={() => { handleLogin(); setIsOpen(false); }}>LOG IN</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for consistent styling
const NavLink = ({ to, children, onClick }: { to: string; children: string; onClick?: () => void }) => (
  <Link to={to} onClick={onClick} className="nav-link">
    {children}
  </Link>
);

export default NavigationBar;
