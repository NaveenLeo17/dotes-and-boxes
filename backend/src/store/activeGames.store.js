const activeGames = new Map();

export const addGame = (gameId, gameState) => {
  activeGames.set(gameId, gameState);
};

export const getGame = (gameId) => {
  return activeGames.get(gameId) || null;
};

export const updateGame = (gameId, updatedGame) => {
  if (!activeGames.has(gameId)) {
    return false;
  }

  activeGames.set(gameId, updatedGame);

  return true;
};

export const hasGame = (gameId) => {
  return activeGames.has(gameId);
};

export const deleteGame = (gameId) => {
  return activeGames.delete(gameId);
};

export const getActiveGamesCount = () => {
  return activeGames.size;
};

export const getAllGames = () => {
  return Array.from(activeGames.values());
};

export const clearGames = () => {
  activeGames.clear();
};
