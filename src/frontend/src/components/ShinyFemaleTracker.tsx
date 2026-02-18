import { useState } from 'react';
import { useSearchShinyFemalePokemon, useLogPokemon } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Sparkles, Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ShinyFemaleTracker() {
  const [pokemonName, setPokemonName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: pokemon = [], isLoading } = useSearchShinyFemalePokemon(searchQuery);
  const logPokemon = useLogPokemon();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pokemonName.trim()) {
      toast.error('Please enter a Pokemon name');
      return;
    }

    try {
      await logPokemon.mutateAsync({
        name: pokemonName.trim(),
        isShiny: true,
        isFemale: true,
      });
      toast.success(`${pokemonName} added to your collection!`);
      setPokemonName('');
      setSearchQuery(''); // Refresh the list
    } catch (error) {
      toast.error('Failed to add Pokemon');
      console.error(error);
    }
  };

  return (
    <Card className="shiny-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="shiny-icon-wrapper">
            <img 
              src="/assets/generated/shiny-sparkle.dim_128x128.png" 
              alt="Shiny" 
              className="w-12 h-12"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">Shiny Female Pokemon</CardTitle>
            <CardDescription>Track your rare shiny female Pokemon collection</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Pokemon Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pokemon-name">Add New Pokemon</Label>
            <div className="flex gap-2">
              <Input
                id="pokemon-name"
                type="text"
                placeholder="Enter Pokemon name (e.g., Pikachu)"
                value={pokemonName}
                onChange={(e) => setPokemonName(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-shiny-pink hover:bg-shiny-pink/90 text-white"
                disabled={logPokemon.isPending}
              >
                {logPokemon.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Search Pokemon */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Collection</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Pokemon List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Your Collection</h3>
            <Badge variant="secondary" className="bg-shiny-pink/20 text-shiny-pink border-shiny-pink/30">
              {pokemon.length} Pokemon
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : pokemon.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No shiny female Pokemon found</p>
              <p className="text-sm">Add your first one above!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pokemon.map((p, index) => (
                <div
                  key={index}
                  className="pokemon-card flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-shiny-pink/10 to-purple-500/10 border-2 border-shiny-pink/20 hover:border-shiny-pink/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-shiny-pink" />
                    <div>
                      <p className="font-semibold text-lg capitalize">{p.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-shiny-pink/10 border-shiny-pink/30">
                          ✨ Shiny
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-pink-500/10 border-pink-500/30">
                          ♀ Female
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
