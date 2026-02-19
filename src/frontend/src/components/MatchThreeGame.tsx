import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { GameBoard } from './GameBoard';
import { GameScoreDisplay } from './GameScoreDisplay';
import { GamePayoutSummary } from './GamePayoutSummary';
import { ShinyDiscoveryNotification } from './ShinyDiscoveryNotification';
import { useGameLogic } from '../hooks/useGameLogic';
import { useRecordMatchResult, useViewPokecoinBalance } from '../hooks/useQueries';
import { RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { Pokemon } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function MatchThreeGame() {
  const { gameState, selectedTile, handleTileClick, resetGame } = useGameLogic();
  const recordMatchResult = useRecordMatchResult();
  const { data: currentBalance } = useViewPokecoinBalance();
  const [discoveredShiny, setDiscoveredShiny] = useState<string | null>(null);
  const [sessionPokecoins, setSessionPokecoins] = useState(0);

  useEffect(() => {
    setSessionPokecoins(gameState.pokecoinsEarned);
  }, [gameState.pokecoinsEarned]);

  const handleGameEnd = async () => {
    if (gameState.pokecoinsEarned > 0 || gameState.discoveredShinies.length > 0) {
      const newShinyPokemon: Pokemon[] = gameState.discoveredShinies.map(name => ({
        name,
        isShiny: true,
        isFemale: true,
      }));

      try {
        await recordMatchResult.mutateAsync({
          pokecoinsEarned: BigInt(gameState.pokecoinsEarned),
          newShinyPokemon,
        });

        toast.success('Game results saved!', {
          description: `Earned ${gameState.pokecoinsEarned} Pokecoins and discovered ${gameState.discoveredShinies.length} shiny Pokemon!`,
        });
      } catch (error) {
        toast.error('Failed to save game results', {
          description: 'Please try again later.',
        });
      }
    }

    resetGame();
    setSessionPokecoins(0);
  };

  const handleTileClickWithShiny = async (row: number, col: number) => {
    const result = await handleTileClick(row, col);
    if (result && result.newShinies.length > 0) {
      result.newShinies.forEach(shinyName => {
        setDiscoveredShiny(shinyName);
        setTimeout(() => setDiscoveredShiny(null), 3000);
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-pokemon-blue/20 bg-gradient-to-br from-card to-pokemon-blue/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-pokemon-blue">Match-Three Pokemon Game</CardTitle>
              <CardDescription className="text-lg mt-2">
                Match three or more Pokemon to earn Pokecoins and discover shiny females!
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How to Play</DialogTitle>
                  <DialogDescription className="space-y-3 pt-4">
                    <p><strong>Goal:</strong> Match 3 or more Pokemon of the same type to earn points and Pokecoins!</p>
                    <p><strong>Controls:</strong> Click on a tile, then click an adjacent tile to swap them.</p>
                    <p><strong>Scoring:</strong> Each match earns points. Combos multiply your score!</p>
                    <p><strong>Pokecoins:</strong> Earn 1 Pokecoin for every 10 points scored.</p>
                    <p><strong>Shiny Pokemon:</strong> Sparkly tiles are rare shiny females! Match them to add to your collection.</p>
                    <p><strong>Payouts:</strong> Every 1000 Pokecoins = $1 Google Play payout.</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <GameScoreDisplay
            score={gameState.score}
            moves={gameState.moves}
            pokecoinsEarned={gameState.pokecoinsEarned}
            combo={gameState.combo}
            currentBalance={currentBalance}
          />

          <GameBoard
            board={gameState.board}
            selectedTile={selectedTile}
            onTileClick={handleTileClickWithShiny}
            isProcessing={gameState.isProcessing}
          />

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleGameEnd}
              disabled={gameState.isProcessing || recordMatchResult.isPending}
              className="bg-pokecoin-gold hover:bg-pokecoin-gold/90 text-white font-semibold"
            >
              {recordMatchResult.isPending ? 'Saving...' : 'End Game & Save'}
            </Button>
            <Button
              onClick={resetGame}
              disabled={gameState.isProcessing}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>

          <GamePayoutSummary
            totalPokecoins={sessionPokecoins}
            currentBalance={currentBalance}
          />
        </CardContent>
      </Card>

      {discoveredShiny && (
        <ShinyDiscoveryNotification pokemonName={discoveredShiny} />
      )}
    </div>
  );
}
