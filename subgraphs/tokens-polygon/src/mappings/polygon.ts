import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/Badger/UChildERC20';
import { getOrCreateTokenBalance } from '../utils/helpers/token/balance';
export function handlePolygonTransfer(event: Transfer): void {
  const token = event.address;
  const fromId = event.params.from.toHexString().concat('-').concat(token.toHexString());
  const toId = event.params.to.toHexString().concat('-').concat(token.toHexString());

  const fromAccount = getOrCreateTokenBalance(fromId, token);
  const toAccount = getOrCreateTokenBalance(toId, token);

  fromAccount.balance = fromAccount.balance.minus(event.params.value);
  toAccount.balance = toAccount.balance.plus(event.params.value);

  fromAccount.save();
  toAccount.save();
}
