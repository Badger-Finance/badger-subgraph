import { Address } from '@graphprotocol/graph-ts';

import { TokenBalance } from '../../../../generated/schema';
import { BIGINT_ZERO } from '../../constants';

import { UChildERC20 } from '../../../../generated/Badger/UChildERC20';
import { Token } from '../../../../generated/schema';
import { DEFAULT_DECIMALS } from '../../decimals';

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

export function getOrCreateToken(tokenAddress: Address, persist: boolean = true): Token {
  let addressString = tokenAddress.toHexString();

  let token = Token.load(addressString);

  if (token == null) {
    token = new Token(addressString);
    token.address = tokenAddress;
    let erc20Token = UChildERC20.bind(tokenAddress);

    let tokenDecimals = erc20Token.try_decimals();
    let tokenName = erc20Token.try_name();
    let tokenSymbol = erc20Token.try_symbol();

    token.decimals = !tokenDecimals.reverted ? tokenDecimals.value : DEFAULT_DECIMALS;
    token.name = !tokenName.reverted ? tokenName.value : '';
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : '';

    if (persist) {
      token.save();
    }
  }

  return token as Token;
}
