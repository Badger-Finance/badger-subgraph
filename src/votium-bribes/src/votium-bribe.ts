import { Bribed } from "../generated/VotiumBribe/VotiumBribe"
import { Bribe } from "../generated/schema"

export function handleBribed(event: Bribed): void {
  const bribe = new Bribe(event.transaction.hash);

  bribe.proposal = event.params._proposal;
  bribe.token = event.params._token;
  bribe.amount = event.params._amount;
  bribe.choiceIndex = event.params._choiceIndex;
  bribe.save();
}
