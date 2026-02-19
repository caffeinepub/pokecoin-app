import { useState, useCallback, useRef, useEffect } from 'react';

export interface Tile {
  id: string;
  type: number;
  isShiny: boolean;
  row: number;
  col: number;
  isMatched: boolean;
  isFalling: boolean;
}

export interface GameState {
  board: Tile[][];
  score: number;
  moves: number;
  pokecoinsEarned: number;
  combo: number;
  discoveredShinies: string[];
  isProcessing: boolean;
}

const BOARD_SIZE = 8;
const TILE_TYPES = 6;
const SHINY_SPAWN_RATE = 0.05;

const POKEMON_NAMES = [
  'Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Eevee', 'Jigglypuff'
];

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    score: 0,
    moves: 0,
    pokecoinsEarned: 0,
    combo: 0,
    discoveredShinies: [],
    isProcessing: false,
  });

  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createTile = useCallback((row: number, col: number): Tile => {
    const type = Math.floor(Math.random() * TILE_TYPES);
    const isShiny = Math.random() < SHINY_SPAWN_RATE;
    return {
      id: `${row}-${col}-${Date.now()}-${Math.random()}`,
      type,
      isShiny,
      row,
      col,
      isMatched: false,
      isFalling: false,
    };
  }, []);

  const initializeBoard = useCallback((): Tile[][] => {
    const board: Tile[][] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        board[row][col] = createTile(row, col);
      }
    }
    return board;
  }, [createTile]);

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      board: initializeBoard(),
    }));
  }, [initializeBoard]);

  const findMatches = useCallback((board: Tile[][]): Tile[] => {
    const matches: Tile[] = [];
    const matched = new Set<string>();

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const tile1 = board[row][col];
        const tile2 = board[row][col + 1];
        const tile3 = board[row][col + 2];

        if (tile1.type === tile2.type && tile2.type === tile3.type) {
          matched.add(tile1.id);
          matched.add(tile2.id);
          matched.add(tile3.id);
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const tile1 = board[row][col];
        const tile2 = board[row + 1][col];
        const tile3 = board[row + 2][col];

        if (tile1.type === tile2.type && tile2.type === tile3.type) {
          matched.add(tile1.id);
          matched.add(tile2.id);
          matched.add(tile3.id);
        }
      }
    }

    // Collect matched tiles
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (matched.has(board[row][col].id)) {
          matches.push(board[row][col]);
        }
      }
    }

    return matches;
  }, []);

  const removeMatches = useCallback((board: Tile[][], matches: Tile[]): Tile[][] => {
    const newBoard = board.map(row => [...row]);
    matches.forEach(match => {
      newBoard[match.row][match.col].isMatched = true;
    });
    return newBoard;
  }, []);

  const applyGravity = useCallback((board: Tile[][]): Tile[][] => {
    const newBoard: Tile[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

    for (let col = 0; col < BOARD_SIZE; col++) {
      let writeRow = BOARD_SIZE - 1;
      
      // Move existing tiles down
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (!board[row][col].isMatched) {
          newBoard[writeRow][col] = {
            ...board[row][col],
            row: writeRow,
            isFalling: writeRow !== row,
          };
          writeRow--;
        }
      }

      // Fill empty spaces with new tiles
      while (writeRow >= 0) {
        newBoard[writeRow][col] = createTile(writeRow, col);
        newBoard[writeRow][col].isFalling = true;
        writeRow--;
      }
    }

    return newBoard;
  }, [createTile]);

  const processMatches = useCallback(async () => {
    setGameState(prev => ({ ...prev, isProcessing: true }));

    let currentBoard = gameState.board;
    let totalMatches = 0;
    let currentCombo = 0;
    let newShinies: string[] = [];

    while (true) {
      const matches = findMatches(currentBoard);
      if (matches.length === 0) break;

      // Check for shiny discoveries
      matches.forEach(tile => {
        if (tile.isShiny) {
          const pokemonName = POKEMON_NAMES[tile.type];
          if (!gameState.discoveredShinies.includes(pokemonName) && !newShinies.includes(pokemonName)) {
            newShinies.push(pokemonName);
          }
        }
      });

      totalMatches += matches.length;
      currentCombo++;

      currentBoard = removeMatches(currentBoard, matches);
      await new Promise(resolve => setTimeout(resolve, 300));

      currentBoard = applyGravity(currentBoard);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    if (totalMatches > 0) {
      const basePoints = totalMatches * 10;
      const comboMultiplier = Math.max(1, currentCombo);
      const points = basePoints * comboMultiplier;
      const pokecoins = Math.floor(points / 10);

      setGameState(prev => ({
        ...prev,
        board: currentBoard,
        score: prev.score + points,
        pokecoinsEarned: prev.pokecoinsEarned + pokecoins,
        combo: currentCombo,
        discoveredShinies: [...prev.discoveredShinies, ...newShinies],
        isProcessing: false,
      }));

      // Reset combo after delay
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      comboTimeoutRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, combo: 0 }));
      }, 2000);

      return { pokecoins, newShinies };
    } else {
      setGameState(prev => ({
        ...prev,
        board: currentBoard,
        isProcessing: false,
      }));
      return { pokecoins: 0, newShinies: [] };
    }
  }, [gameState.board, gameState.discoveredShinies, findMatches, removeMatches, applyGravity]);

  const swapTiles = useCallback(async (row1: number, col1: number, row2: number, col2: number) => {
    if (gameState.isProcessing) return;

    // Check if tiles are adjacent
    const isAdjacent = 
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2);

    if (!isAdjacent) return;

    // Swap tiles
    const newBoard = gameState.board.map(row => [...row]);
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = { ...newBoard[row2][col2], row: row1, col: col1 };
    newBoard[row2][col2] = { ...temp, row: row2, col: col2 };

    setGameState(prev => ({ ...prev, board: newBoard }));
    await new Promise(resolve => setTimeout(resolve, 200));

    // Check for matches
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      setGameState(prev => ({ ...prev, moves: prev.moves + 1 }));
      return await processMatches();
    } else {
      // Swap back if no matches
      const revertBoard = newBoard.map(row => [...row]);
      const temp2 = revertBoard[row1][col1];
      revertBoard[row1][col1] = { ...revertBoard[row2][col2], row: row1, col: col1 };
      revertBoard[row2][col2] = { ...temp2, row: row2, col: col2 };
      setGameState(prev => ({ ...prev, board: revertBoard }));
      return { pokecoins: 0, newShinies: [] };
    }
  }, [gameState.board, gameState.isProcessing, findMatches, processMatches]);

  const handleTileClick = useCallback(async (row: number, col: number) => {
    if (gameState.isProcessing) return;

    if (!selectedTile) {
      setSelectedTile({ row, col });
    } else {
      const result = await swapTiles(selectedTile.row, selectedTile.col, row, col);
      setSelectedTile(null);
      return result;
    }
  }, [selectedTile, gameState.isProcessing, swapTiles]);

  const resetGame = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      moves: 0,
      pokecoinsEarned: 0,
      combo: 0,
      discoveredShinies: [],
      isProcessing: false,
    });
    setSelectedTile(null);
  }, [initializeBoard]);

  return {
    gameState,
    selectedTile,
    handleTileClick,
    resetGame,
  };
}
