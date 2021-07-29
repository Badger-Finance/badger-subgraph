import { Address } from '@graphprotocol/graph-ts';

import { TokenBalance } from '../../../../generated/schema';
import { BIGINT_ZERO } from '../../constants';
import { getOrCreateToken } from '../yVault/token';
export function getOrCreateTokenBalance(id: String, address: Address): TokenBalance {
  let tokenBalance = TokenBalance.load(id.toString());
  if (tokenBalance == null) {
    tokenBalance = new TokenBalance(id.toString());
    tokenBalance.balance = BIGINT_ZERO;
    let token = getOrCreateToken(address);
    tokenBalance.token = token.id;
  }
  return tokenBalance as TokenBalance;
}
