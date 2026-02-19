import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, TrendingUp, Coins } from 'lucide-react';
import { Progress } from './ui/progress';

interface GamePayoutSummaryProps {
  totalPokecoins: number;
  currentBalance: bigint | null | undefined;
}

const PAYOUT_THRESHOLD = 1000;
const CONVERSION_RATE = 1000; // 1000 Pokecoins = $1

export function GamePayoutSummary({ totalPokecoins, currentBalance }: GamePayoutSummaryProps) {
  const balance = currentBalance ? Number(currentBalance) : 0;
  const totalWithSession = balance + totalPokecoins;
  const payoutAmount = (totalWithSession / CONVERSION_RATE).toFixed(2);
  const progressToNextPayout = ((totalWithSession % PAYOUT_THRESHOLD) / PAYOUT_THRESHOLD) * 100;
  const nextPayoutIn = PAYOUT_THRESHOLD - (totalWithSession % PAYOUT_THRESHOLD);

  return (
    <Card className="payout-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-payout-green">
          <DollarSign className="w-5 h-5" />
          Payout Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Coins className="w-3 h-3" />
              Total Balance
            </div>
            <div className="text-2xl font-bold text-pokecoin-gold">
              {totalWithSession.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Payout Value
            </div>
            <div className="text-2xl font-bold text-payout-green">
              ${payoutAmount}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Next Payout In
            </div>
            <div className="text-2xl font-bold">
              {nextPayoutIn}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to next $1 payout</span>
            <span className="font-semibold">{progressToNextPayout.toFixed(0)}%</span>
          </div>
          <Progress value={progressToNextPayout} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Conversion Rate: 1,000 Pokecoins = $1.00 Google Play Credit
        </div>
      </CardContent>
    </Card>
  );
}
