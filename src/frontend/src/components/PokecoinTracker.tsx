import { useState } from 'react';
import { useViewPokecoinBalance, useLogPokecoinBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Coins, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PokecoinTracker() {
  const [newBalance, setNewBalance] = useState('');
  const { data: balance, isLoading } = useViewPokecoinBalance();
  const logBalance = useLogPokecoinBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceValue = parseInt(newBalance);
    
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast.error('Please enter a valid Pokecoin amount');
      return;
    }

    try {
      await logBalance.mutateAsync(BigInt(balanceValue));
      toast.success('Pokecoin balance updated!');
      setNewBalance('');
    } catch (error) {
      toast.error('Failed to update balance');
      console.error(error);
    }
  };

  return (
    <Card className="pokecoin-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="pokecoin-icon-wrapper">
            <img 
              src="/assets/generated/pokecoin-icon.dim_256x256.png" 
              alt="Pokecoin" 
              className="w-12 h-12"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">Pokecoin Balance</CardTitle>
            <CardDescription>Track your Pokemon GO Pokecoins</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance Display */}
        <div className="balance-display">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-pokecoin-gold/20 to-pokecoin-gold/5 border-2 border-pokecoin-gold/30">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-2xl font-bold">Loading...</span>
                </div>
              ) : balance !== null && balance !== undefined ? (
                <p className="text-4xl font-bold text-pokecoin-gold flex items-center gap-2">
                  <Coins className="w-8 h-8" />
                  {balance.toString()}
                </p>
              ) : (
                <p className="text-2xl font-semibold text-muted-foreground">No balance logged yet</p>
              )}
            </div>
            <TrendingUp className="w-12 h-12 text-pokecoin-gold/40" />
          </div>
        </div>

        {/* Update Balance Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Update Balance</Label>
            <Input
              id="balance"
              type="number"
              placeholder="Enter your current Pokecoin balance"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              min="0"
              className="text-lg"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-pokecoin-gold hover:bg-pokecoin-gold/90 text-white font-semibold"
            disabled={logBalance.isPending}
          >
            {logBalance.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Coins className="w-4 h-4 mr-2" />
                Update Balance
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
