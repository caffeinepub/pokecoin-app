import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Pokemon, Payout } from '../backend';

// Pokecoin Balance Queries
export function useViewPokecoinBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['pokecoinBalance'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.viewPokecoinBalance();
      } catch (error) {
        // Return null if no balance found yet
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogPokecoinBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (balance: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.logPokecoinBalance(balance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokecoinBalance'] });
    },
  });
}

// Pokemon Queries
export function useSearchShinyFemalePokemon(searchName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Pokemon[]>({
    queryKey: ['shinyFemalePokemon', searchName],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.searchShinyFemalePokemon(searchName);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogPokemon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, isShiny, isFemale }: { name: string; isShiny: boolean; isFemale: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.logPokemon(name, isShiny, isFemale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shinyFemalePokemon'] });
    },
  });
}

// Payout Queries
export function useViewPayouts() {
  const { actor, isFetching } = useActor();

  return useQuery<Payout[]>({
    queryKey: ['payouts'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.viewPayouts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogPayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, currency, date }: { amount: bigint; currency: string; date: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.logPayout(amount, currency, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
    },
  });
}

export function useCalculatePayout() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pokecoins: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.calculatePayout(pokecoins);
    },
  });
}

export function useRecordMatchResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pokecoinsEarned, newShinyPokemon }: { pokecoinsEarned: bigint; newShinyPokemon: Pokemon[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.recordMatchResult(pokecoinsEarned, newShinyPokemon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokecoinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['shinyFemalePokemon'] });
    },
  });
}
