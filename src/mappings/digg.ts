import { Address } from '@graphprotocol/graph-ts';

import { Transfer, UFragments } from '../../generated/Digg/UFragments';
import { getOrCreateTokenBalance } from '../utils/helpers/token/balance';
export function handleDiggTransfer(event: Transfer): void {
  let diggToken = Address.fromString('0x798d1be841a82a273720ce31c822c61a67a601c3');
  let digg = UFragments.bind(diggToken);
  let fromId = event.params.from
    .toHexString()
    .concat('-')
    .concat(diggToken.toHexString());
  let toId = event.params.to.toHexString().concat('-').concat(diggToken.toHexString());
  let fromAccount = getOrCreateTokenBalance(fromId, diggToken);
  let toAccount = getOrCreateTokenBalance(toId, diggToken);
  let shares = digg.fragmentsToShares(event.params.value);
  fromAccount.balance = fromAccount.balance.minus(shares);
  toAccount.balance = toAccount.balance.plus(shares);

  fromAccount.save();
  toAccount.save();
}
