import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createGame, updateGame } from "../firebase/firestore";
import { Game } from "../firebase/firestore";
import "./styles/CreatePage.css";

const CreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameData = searchParams.get("data");

  // Default game state (empty for new game)
  const [game, setGame] = useState<Game>({
    id: "",
    name: "",
    cafe: "",
    location: "",
    category: "",
    age: "",
    players: "",
    playtime: "",
    imgurl: "",
  });

  // If editing, set game state with existing data
  useEffect(() => {
    if (gameData) {
      try {
        const parsedGame = JSON.parse(decodeURIComponent(gameData)) as Game;
        setGame(parsedGame);
      } catch (error) {
        console.error("Error parsing game data:", error);
      }
    }
  }, [gameData]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGame({ ...game, [e.target.name]: e.target.value });
  };

  // Handle form submission (create new game)
  const handleCreate = async () => {
    await createGame(game);
    navigate("/games"); // Redirect back to games page
  };

  // Handle form submission (update existing game)
  const handleUpdate = async () => {
    if (game.id) {
      await updateGame(game.id, game);
      navigate("/games"); // Redirect back to games page
    }
  };

  return (
    <div className="create-game-page">
      <h1>{gameData ? "Edit Game" : "Create New Game"}</h1>

      <form className="game-form">
        <div className="form-grid">
          <label>Name:</label>
          <input type="text" name="name" value={game.name} onChange={handleChange} required />

          <label>Cafe:</label>
          <select name="cafe" value={game.cafe} onChange={handleChange} required>
            <option value="">Select Cafe</option>
            <option value="Vestergade">Vestergade</option>
            <option value="Fredensgade">Fredensgade</option>
            <option value="Aalborg">Aalborg</option>
            <option value="Kolding">Kolding</option>
          </select>

          <label>Location:</label>
          <input type="text" name="location" value={game.location} onChange={handleChange} required />

          <label>Category:</label>
          <input type="text" name="category" value={game.category} onChange={handleChange} required />

          <label>Age:</label>
          <input type="text" name="age" value={game.age} onChange={handleChange} required />

          <label>Players:</label>
          <input type="text" name="players" value={game.players} onChange={handleChange} required />

          <label>Playtime:</label>
          <input type="text" name="playtime" value={game.playtime} onChange={handleChange} required />

          {/* Full-width input for image URL */}
          <label>Image URL:</label>
          <input type="text" name="imgurl" value={game.imgurl} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          {gameData ? (
            <button type="button" className="update-btn" onClick={handleUpdate}>Update</button>
          ) : (
            <button type="button" className="create-btn" onClick={handleCreate}>Create</button>
          )}
          <button type="button" className="cancel-btn" onClick={() => navigate("/games")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
