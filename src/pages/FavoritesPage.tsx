import { useEffect, useState } from "react";
import { getGames, deleteGame, Game } from "../firebase/firestore";
import { useAuth } from "../firebase/AuthProvider"; // Import auth hook
import GameCard from "../components/GameCard";
import "./styles/GamesPage.css";

const FavoritesPage = () => {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const gamesData = await getGames();
    if (user) {
      const favoritedGames = gamesData.filter((game) =>
        game.likedBy?.includes(user.email)
      );
      setGames(favoritedGames);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      await deleteGame(gameId);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    }
  };

  // Callback for when a game is unhearted
  const handleFavoriteToggle = () => {
    fetchGames(); // Refresh favorites list
  };

  return (
    <div className="games-page">
      <h1>Favorites</h1>

      {games.length > 0 ? (
        <div className="game-list">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={() => handleDelete(game.id)}
              onFavoriteToggle={handleFavoriteToggle} // Pass callback
            />
          ))}
        </div>
      ) : (
        <p>No favorite games yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
