import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PokecoinTracker } from './components/PokecoinTracker';
import { ShinyFemaleTracker } from './components/ShinyFemaleTracker';
import { PayoutManager } from './components/PayoutManager';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Button } from './components/ui/button';
import { Sparkles, Coins, DollarSign } from 'lucide-react';

function App() {
  const { identity, login, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container py-8">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-16 h-16 text-shiny-pink" />
                  <Coins className="w-16 h-16 text-pokecoin-gold" />
                  <DollarSign className="w-16 h-16 text-payout-green" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pokecoin-gold via-shiny-pink to-payout-green bg-clip-text text-transparent">
                  Welcome to Shiny Coin Tracker
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Track your Pokemon GO Pokecoins, manage your shiny female Pokemon collection, 
                  and monitor your Google Play payouts all in one place!
                </p>
              </div>
              <Button 
                onClick={login}
                disabled={isLoggingIn || loginStatus === 'initializing'}
                size="lg"
                className="bg-pokecoin-gold hover:bg-pokecoin-gold/90 text-white font-semibold text-lg px-8 py-6"
              >
                {isLoggingIn ? 'Connecting...' : 'Login to Get Started'}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="pokecoins" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1">
                <TabsTrigger 
                  value="pokecoins" 
                  className="data-[state=active]:bg-pokecoin-gold/20 data-[state=active]:text-pokecoin-gold flex items-center gap-2 py-3"
                >
                  <Coins className="w-4 h-4" />
                  <span className="hidden sm:inline">Pokecoins</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pokemon" 
                  className="data-[state=active]:bg-shiny-pink/20 data-[state=active]:text-shiny-pink flex items-center gap-2 py-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Shiny Pokemon</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="payouts" 
                  className="data-[state=active]:bg-payout-green/20 data-[state=active]:text-payout-green flex items-center gap-2 py-3"
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">Payouts</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pokecoins" className="space-y-4">
                <PokecoinTracker />
              </TabsContent>
              
              <TabsContent value="pokemon" className="space-y-4">
                <ShinyFemaleTracker />
              </TabsContent>
              
              <TabsContent value="payouts" className="space-y-4">
                <PayoutManager />
              </TabsContent>
            </Tabs>
          )}
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
