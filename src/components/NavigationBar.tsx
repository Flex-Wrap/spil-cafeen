import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./styles/NavigationBar.css"; // Import the new CSS file

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo">
            <Link to="/">SPILCAFEEN</Link>
          </div>

          {/* Desktop Menu */}
          <div className="nav-links">
            <NavLink to="/games">GAMES</NavLink>
            <NavLink to="/create-game">CREATE</NavLink>
            <NavLink to="/login">LOG IN</NavLink>
          </div>

          {/* Mobile Menu Button */}
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
            <NavLink to="/create-game" onClick={() => setIsOpen(false)}>NEW GAME</NavLink>
            <NavLink to="/login" onClick={() => setIsOpen(false)}>LOG IN</NavLink>
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
