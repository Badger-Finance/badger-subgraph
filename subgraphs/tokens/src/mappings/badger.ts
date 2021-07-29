import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/Badger/MiniMeToken';
import { getOrCreateTokenBalance } from '../utils/helpers/token/balance';
export function handleBadgerTransfer(event: Transfer): void {
  let badgerToken = Address.fromString('0x3472a5a71965499acd81997a54bba8d852c6e53d');
  let fromId = event.params._from
    .toHexString()
    .concat('-')
    .concat(badgerToken.toHexString());
  let toId = event.params._to.toHexString().concat('-').concat(badgerToken.toHexString());

  let fromAccount = getOrCreateTokenBalance(fromId, badgerToken);
  let toAccount = getOrCreateTokenBalance(toId, badgerToken);

  fromAccount.balance = fromAccount.balance.minus(event.params._amount);
  toAccount.balance = toAccount.balance.plus(event.params._amount);

  fromAccount.save();
  toAccount.save();
}
