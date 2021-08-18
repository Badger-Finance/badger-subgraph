import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/Badger/UChildERC20';
import { getOrCreateTokenBalance } from '../utils/helpers/token/balance';
export function handlePolygonTransfer(event: Transfer): void {
  let badgerToken = event.address
  let fromId = event.params.from
    .toHexString()
    .concat('-')
    .concat(badgerToken.toHexString());
  let toId = event.params.to.toHexString().concat('-').concat(badgerToken.toHexString());

  let fromAccount = getOrCreateTokenBalance(fromId, badgerToken);
  let toAccount = getOrCreateTokenBalance(toId, badgerToken);

  fromAccount.balance = fromAccount.balance.minus(event.params.value);
  toAccount.balance = toAccount.balance.plus(event.params.value);

  fromAccount.save();
  toAccount.save();
}
