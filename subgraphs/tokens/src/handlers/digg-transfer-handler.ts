import { Transfer, UFragments } from '../../generated/Digg/UFragments';
import { loadTokenBalance } from "../entities/token-balance";

export function handleTransfer(event: Transfer): void {
  let digg = UFragments.bind(event.address);
  let from = loadTokenBalance(event.address, event.params.from);
  let to = loadTokenBalance(event.address, event.params.to);
  let shares = digg.fragmentsToShares(event.params.value);
  from.balance = from.balance.minus(shares);
  to.balance = to.balance.plus(shares);
  from.save();
  to.save();
}
