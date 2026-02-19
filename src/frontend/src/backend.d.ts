import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Pokemon {
    isShiny: boolean;
    name: string;
    isFemale: boolean;
}
export interface Payout {
    date: string;
    currency: string;
    amount: bigint;
}
export interface backendInterface {
    calculatePayout(pokecoins: bigint): Promise<bigint>;
    logPayout(amount: bigint, currency: string, date: string): Promise<void>;
    logPokecoinBalance(balance: bigint): Promise<void>;
    logPokemon(name: string, isShiny: boolean, isFemale: boolean): Promise<void>;
    recordMatchResult(pokecoinsEarned: bigint, newShinyPokemon: Array<Pokemon>): Promise<void>;
    searchShinyFemalePokemon(searchName: string): Promise<Array<Pokemon>>;
    viewPayouts(): Promise<Array<Payout>>;
    viewPokecoinBalance(): Promise<bigint>;
}
