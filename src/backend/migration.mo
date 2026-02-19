import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {
  type Pokemon = {
    name : Text;
    isShiny : Bool;
    isFemale : Bool;
  };

  type Payout = {
    amount : Nat;
    currency : Text;
    date : Text;
  };

  type MatchResult = {
    pokecoinsEarned : Nat;
    newShinyPokemon : [Pokemon];
  };

  type OldActor = {
    pokecoinBalances : Map.Map<Principal, Nat>;
    pokemonData : Map.Map<Principal, [Pokemon]>;
    payouts : Map.Map<Principal, [Payout]>;
  };

  type NewActor = {
    pokecoinBalances : Map.Map<Principal, Nat>;
    pokemonData : Map.Map<Principal, [Pokemon]>;
    payouts : Map.Map<Principal, [Payout]>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
