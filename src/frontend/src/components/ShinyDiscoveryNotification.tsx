import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Sparkles } from 'lucide-react';

interface ShinyDiscoveryNotificationProps {
  pokemonName: string;
}

export function ShinyDiscoveryNotification({ pokemonName }: ShinyDiscoveryNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Card className="shiny-card animate-in zoom-in-95 duration-500 pointer-events-auto max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="relative inline-block">
            <img 
              src="/assets/generated/shiny-sparkle.dim_128x128.png" 
              alt="Sparkle" 
              className="w-24 h-24 mx-auto animate-spin"
              style={{ animationDuration: '3s' }}
            />
            <Sparkles className="absolute top-0 right-0 w-8 h-8 text-shiny-pink animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-shiny-pink">
              Shiny Discovery!
            </h3>
            <p className="text-lg font-semibold">
              You found a Shiny Female {pokemonName}!
            </p>
            <p className="text-sm text-muted-foreground">
              Added to your collection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
