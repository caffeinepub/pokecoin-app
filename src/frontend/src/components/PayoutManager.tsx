import { useState } from 'react';
import { useViewPayouts, useLogPayout } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { DollarSign, Calendar, Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export function PayoutManager() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { data: payouts = [], isLoading } = useViewPayouts();
  const logPayout = useLogPayout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid payout amount');
      return;
    }

    const date = new Date().toISOString().split('T')[0];

    try {
      await logPayout.mutateAsync({
        amount: BigInt(Math.round(amountValue * 100)), // Store as cents
        currency,
        date,
      });
      toast.success('Payout recorded successfully!');
      setAmount('');
    } catch (error) {
      toast.error('Failed to record payout');
      console.error(error);
    }
  };

  // Calculate total payouts by currency
  const totalsByCurrency = payouts.reduce((acc, payout) => {
    const curr = payout.currency;
    const amt = Number(payout.amount) / 100; // Convert from cents
    acc[curr] = (acc[curr] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="payout-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="payout-icon-wrapper">
            <img 
              src="/assets/generated/payout-badge.dim_128x128.png" 
              alt="Payout" 
              className="w-12 h-12"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">Google Play Payouts</CardTitle>
            <CardDescription>Track your earnings from Pokecoins</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Earnings Display */}
        <div className="earnings-display">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-payout-green/20 to-payout-green/5 border-2 border-payout-green/30">
            <p className="text-sm text-muted-foreground mb-3">Total Earnings</p>
            {Object.keys(totalsByCurrency).length === 0 ? (
              <p className="text-xl font-semibold text-muted-foreground">No payouts recorded yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(totalsByCurrency).map(([curr, total]) => (
                  <div key={curr} className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-payout-green" />
                    <span className="text-3xl font-bold text-payout-green">
                      {total.toFixed(2)} {curr}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Payout Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-payout-green hover:bg-payout-green/90 text-white font-semibold"
            disabled={logPayout.isPending}
          >
            {logPayout.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Record Payout
              </>
            )}
          </Button>
        </form>

        {/* Payout History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Payout History</h3>
            <Badge variant="secondary" className="bg-payout-green/20 text-payout-green border-payout-green/30">
              {payouts.length} Payouts
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No payouts recorded yet</p>
              <p className="text-sm">Add your first payout above!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {payouts.slice().reverse().map((payout, index) => (
                <div
                  key={index}
                  className="payout-item flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-payout-green/5 to-payout-green/10 border border-payout-green/20"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-payout-green" />
                    <div>
                      <p className="font-semibold text-lg">
                        {(Number(payout.amount) / 100).toFixed(2)} {payout.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-payout-green/10 border-payout-green/30">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
