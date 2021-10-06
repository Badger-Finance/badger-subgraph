import { Transfer } from '../../generated/Badger/UChildERC20';
import { loadTokenBalance } from '../entities/token-balance';

export function handleTransfer(event: Transfer): void {
  let from = loadTokenBalance(event.address, event.params.from);
  let to = loadTokenBalance(event.address, event.params.to);
  from.balance = from.balance.minus(event.params.value);
  to.balance = to.balance.plus(event.params.value);
  from.save();
  to.save();
}
