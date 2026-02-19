import { Card, CardContent } from './ui/card';
import { Coins, Zap, Move } from 'lucide-react';

interface GameScoreDisplayProps {
  score: number;
  moves: number;
  pokecoinsEarned: number;
  combo: number;
  currentBalance: bigint | null | undefined;
}

export function GameScoreDisplay({ score, moves, pokecoinsEarned, combo, currentBalance }: GameScoreDisplayProps) {
  const totalBalance = currentBalance ? Number(currentBalance) + pokecoinsEarned : pokecoinsEarned;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-card to-pokemon-blue/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-pokemon-blue">{score}</div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <Zap className="w-3 h-3" />
            Score
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-pokecoin-gold/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-pokecoin-gold flex items-center justify-center gap-1">
            <Coins className="w-5 h-5" />
            {pokecoinsEarned}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Earned
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-muted/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold flex items-center justify-center gap-1">
            <Move className="w-5 h-5" />
            {moves}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Moves
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-pokemon-red/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-pokemon-red">
            {combo > 0 ? `${combo}x` : '-'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Combo
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
