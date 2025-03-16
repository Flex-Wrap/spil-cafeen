import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthProvider"; // Import auth hook
import { Game, addToFavorites, removeFromFavorites, getGameById } from "../firebase/firestore";
import "./styles/GameCard.css";
import categoryIcon from "../assets/category-icon.png";
import playersIcon from "../assets/players-icon.png";
import timeIcon from "../assets/time-icon.png";

interface GameCardProps {
  game: Game;
  onDelete: () => void;
  onFavoriteToggle?: (gameId: string) => void; // Callback for when favorite is toggled
}

const GameCard: React.FC<GameCardProps> = ({ game, onDelete, onFavoriteToggle }) => {
  const { user, isAdmin } = useAuth(); // Get user and admin status
  const navigate = useNavigate(); // Hook for navigation
  const [currentGame, setCurrentGame] = useState<Game>(game); // Store the latest game data

  const isFavorited = user && currentGame.likedBy?.includes(user.email); // Check if user has favorited this game
  const likesCount = currentGame.likedBy?.length || 0;
  // Handle Add/Remove Favorite
  const handleToggleFavorite = async () => {
    if (!user) return; // Ensure user is logged in

    if (isFavorited) {
      await removeFromFavorites(game.id, user.email);
    } else {
      await addToFavorites(game.id, user.email);
    }

    // Fetch latest game data from Firestore
    const updatedGame = await getGameById(game.id);
    if (updatedGame) {
      setCurrentGame(updatedGame);
      
      // If the game is no longer liked by the user, notify the parent
      if (!updatedGame.likedBy?.includes(user.email)) {
        onFavoriteToggle?.(game.id);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/create-game?data=${encodeURIComponent(JSON.stringify(game))}`);
  };

  return (
    <div className="game-card">
      <h2 className="game-title">{currentGame.name}</h2>

      {/* Game properties - Icons on top, values below */}
      <div className="game-properties">
        <img src={categoryIcon} alt="Category" />
        <img src={playersIcon} alt="Players" />
        <img src={timeIcon} alt="Playtime" />
        <span>{currentGame.category}</span>
        <span>{currentGame.players}</span>
        <span>{currentGame.playtime}</span>
      </div>

      {/* Game location */}
      <div className="game-location">
        <strong>{currentGame.cafe}</strong> - {currentGame.location}
      </div>

      {/* Game image */}
      <div className="game-image">
        <img src={currentGame.imgurl} alt={currentGame.name} />
      </div>

      {/* Actions: Only show if user is logged in */}
      {user && (
        <div className="game-actions">
          {/* Favorite Button (Toggles Add/Remove) */}
          <button className="favorite-btn" onClick={handleToggleFavorite}>
            {isFavorited ? "💔" : "❤️"}
          </button>

          {/* Admin-specific buttons */}
          {isAdmin && (
            <>
              <button className="edit-btn" onClick={handleEdit}>✏️</button>
              <button className="delete-btn" onClick={onDelete}>🗑️</button>
            </>
          )}
        </div>
      )}
      <div className="game-likes">❤️ {likesCount-1} Likes</div>
    </div>
  );
};

export default GameCard;
