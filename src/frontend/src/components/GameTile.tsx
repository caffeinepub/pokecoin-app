import { memo } from 'react';
import type { Tile } from '../hooks/useGameLogic';
import { Sparkles } from 'lucide-react';

interface GameTileProps {
  tile: Tile;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const TILE_COLORS = [
  'oklch(0.75 0.18 65)',    // Gold (Pikachu)
  'oklch(0.58 0.24 25)',    // Red (Charmander)
  'oklch(0.65 0.20 145)',   // Green (Bulbasaur)
  'oklch(0.60 0.18 240)',   // Blue (Squirtle)
  'oklch(0.70 0.15 50)',    // Brown (Eevee)
  'oklch(0.70 0.22 340)',   // Pink (Jigglypuff)
];

const POKEMON_NAMES = [
  'Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Eevee', 'Jigglypuff'
];

export const GameTile = memo(function GameTile({ tile, isSelected, onClick, disabled }: GameTileProps) {
  const backgroundColor = TILE_COLORS[tile.type];
  const pokemonName = POKEMON_NAMES[tile.type];

  return (
    <button
      onClick={onClick}
      disabled={disabled || tile.isMatched}
      className={`
        relative aspect-square rounded-lg transition-all duration-200
        ${tile.isMatched ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
        ${tile.isFalling ? 'animate-bounce' : ''}
        ${isSelected ? 'ring-4 ring-white scale-110 z-10' : 'hover:scale-105'}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        shadow-lg hover:shadow-xl
      `}
      style={{
        backgroundColor,
        boxShadow: tile.isShiny 
          ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)' 
          : undefined,
      }}
      aria-label={`${tile.isShiny ? 'Shiny ' : ''}${pokemonName} tile`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">
          {pokemonName.slice(0, 3)}
        </span>
      </div>
      
      {tile.isShiny && (
        <div className="absolute top-0 right-0 p-0.5">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
        </div>
      )}
    </button>
  );
});
