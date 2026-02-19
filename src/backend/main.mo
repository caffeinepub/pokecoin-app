import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  let pokecoinBalances = Map.empty<Principal, Nat>();
  let pokemonData = Map.empty<Principal, [Pokemon]>();
  let payouts = Map.empty<Principal, [Payout]>();

  public shared ({ caller }) func logPokecoinBalance(balance : Nat) : async () {
    pokecoinBalances.add(caller, balance);
  };

  public query ({ caller }) func viewPokecoinBalance() : async Nat {
    switch (pokecoinBalances.get(caller)) {
      case (null) { Runtime.trap("No balance found for this user") };
      case (?balance) { balance };
    };
  };

  public shared ({ caller }) func logPokemon(name : Text, isShiny : Bool, isFemale : Bool) : async () {
    let newPokemon : Pokemon = {
      name;
      isShiny;
      isFemale;
    };
    let existingPokemon = switch (pokemonData.get(caller)) {
      case (null) { [] };
      case (?pokemons) { pokemons };
    };
    pokemonData.add(caller, existingPokemon.concat([newPokemon]));
  };

  public query ({ caller }) func searchShinyFemalePokemon(searchName : Text) : async [Pokemon] {
    let userPokemons = switch (pokemonData.get(caller)) {
      case (null) { [] };
      case (?pokemons) { pokemons };
    };

    userPokemons.filter(
      func(pokemon) {
        pokemon.isShiny and pokemon.isFemale and pokemon.name.contains(#text searchName);
      }
    );
  };

  public shared ({ caller }) func logPayout(amount : Nat, currency : Text, date : Text) : async () {
    let newPayout : Payout = {
      amount;
      currency;
      date;
    };
    let existingPayouts = switch (payouts.get(caller)) {
      case (null) { [] };
      case (?payoutsList) { payoutsList };
    };
    payouts.add(caller, existingPayouts.concat([newPayout]));
  };

  public query ({ caller }) func viewPayouts() : async [Payout] {
    switch (payouts.get(caller)) {
      case (null) { [] };
      case (?userPayouts) { userPayouts };
    };
  };

  public query ({ caller }) func calculatePayout(pokecoins : Nat) : async Nat {
    pokecoins / 1000;
  };

  public shared ({ caller }) func recordMatchResult(pokecoinsEarned : Nat, newShinyPokemon : [Pokemon]) : async () {
    let currentBalance = switch (pokecoinBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
    pokecoinBalances.add(caller, currentBalance + pokecoinsEarned);

    let existingPokemon = switch (pokemonData.get(caller)) {
      case (null) { [] };
      case (?pokemons) { pokemons };
    };
    pokemonData.add(caller, existingPokemon.concat(newShinyPokemon));
  };
};
