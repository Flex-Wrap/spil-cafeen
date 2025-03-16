import { useEffect, useState } from "react";
import { getGames, deleteGame, Game } from "../firebase/firestore"; // Import getGames and deleteGame
import GameCard from "../components/GameCard";
import "./styles/GamesPage.css";

const GamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch games from Firestore
  const fetchGames = async () => {
    const gamesData = await getGames();
    setGames(gamesData);
  };

  // Delete game from Firestore and update state
  const handleDelete = async (gameId: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      await deleteGame(gameId);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    }
  };

  // Group games by café
  const groupedGames = {
    Vestergade: games.filter((game) => game.cafe === "Vestergade"),
    Fredensgade: games.filter((game) => game.cafe === "Fredensgade"),
    Aalborg: games.filter((game) => game.cafe === "Aalborg"),
    Kolding: games.filter((game) => game.cafe === "Kolding"),
  };

  return (
    <div className="games-page">
      <h1>Games</h1>

      {Object.entries(groupedGames).map(([cafe, gamesList]) => (
        <details key={cafe} className="cafe-accordion">
          <summary className="cafe-title">{cafe}</summary>
          <div className="game-list">
            {gamesList.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={() => handleDelete(game.id)}
              />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
};

export default GamesPage;
