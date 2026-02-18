import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Header() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-shiny-pink" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pokecoin-gold via-shiny-pink to-payout-green bg-clip-text text-transparent">
              Shiny Coin Tracker
            </h1>
          </div>
        </div>
        
        <div>
          {isAuthenticated ? (
            <Button 
              onClick={clear}
              variant="outline"
              className="border-pokecoin-gold/30 hover:bg-pokecoin-gold/10"
            >
              Logout
            </Button>
          ) : (
            <Button 
              onClick={login}
              disabled={isLoggingIn || loginStatus === 'initializing'}
              className="bg-pokecoin-gold hover:bg-pokecoin-gold/90 text-white font-semibold"
            >
              {isLoggingIn ? 'Connecting...' : 'Login'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
