import { GameTile } from './GameTile';
import type { Tile } from '../hooks/useGameLogic';

interface GameBoardProps {
  board: Tile[][];
  selectedTile: { row: number; col: number } | null;
  onTileClick: (row: number, col: number) => void;
  isProcessing: boolean;
}

export function GameBoard({ board, selectedTile, onTileClick, isProcessing }: GameBoardProps) {
  if (!board || board.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Loading game board...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative mx-auto rounded-xl p-4 shadow-2xl"
      style={{
        maxWidth: '600px',
        backgroundImage: 'url(/assets/generated/game-board-bg.dim_800x800.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="grid gap-1 bg-black/20 p-2 rounded-lg backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <GameTile
              key={tile.id}
              tile={tile}
              isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              onClick={() => !isProcessing && onTileClick(rowIndex, colIndex)}
              disabled={isProcessing}
            />
          ))
        )}
      </div>
    </div>
  );
}
