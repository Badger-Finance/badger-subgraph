import { TransferSingle } from '../../generated/BadgerERC1155/BadgerERC1155';
import { TransferSingle as TransferSingleMeme } from '../../generated/MemeLtd/MemeLtd';
import { NFT_Token as Token, NFT_TokenBalance as TokenBalance, NFT_User as User } from '../../generated/schema';
import { ZERO } from '../constants';

function getOrCreateTokenBalance(token: string, owner: string): TokenBalance {
  let tokenBalance = TokenBalance.load(token);
  if (tokenBalance == null) {
    tokenBalance = new TokenBalance(token.concat('-').concat(owner));
    tokenBalance.token = token.toString();
    tokenBalance.owner = owner.toString();
    tokenBalance.amount = ZERO;
  }
  tokenBalance.save();
  return tokenBalance as TokenBalance;
}

function getOrCreateUser(address: string): User {
  let user = User.load(address);
  if (user == null) {
    user = new User(address);
  }
  user.save();
  return user as User;
}

export function handleNFTTransfer(event: TransferSingle): void {
  let tokenObjectId = event.address.toHexString().concat('-').concat(event.params.id.toString());

  let token = Token.load(tokenObjectId);

  if (token == null) {
    token = new Token(tokenObjectId);
    token.tokenId = event.params.id;
    token.save();
  }

  let tokenBalanceFrom = getOrCreateTokenBalance(tokenObjectId, event.params.from.toHexString());
  let tokenBalanceTo = getOrCreateTokenBalance(tokenObjectId, event.params.to.toHexString());

  tokenBalanceTo.amount = tokenBalanceTo.amount.plus(event.params.value);
  tokenBalanceFrom.amount = tokenBalanceFrom.amount.minus(event.params.value);

  tokenBalanceTo.save();
  tokenBalanceFrom.save();

  getOrCreateUser(event.params.to.toHexString());
  getOrCreateUser(event.params.from.toHexString());
}

export function handleMemeNFTTransfer(event: TransferSingleMeme): void {
  let tokenObjectId = event.address.toHexString().concat('-').concat(event.params._id.toString());

  let token = Token.load(tokenObjectId);
  if (token == null) {
    token = new Token(tokenObjectId);
    token.tokenId = event.params._id;

    token.save();
  }

  let tokenBalanceFrom = getOrCreateTokenBalance(tokenObjectId, event.params._from.toHexString());
  let tokenBalanceTo = getOrCreateTokenBalance(tokenObjectId, event.params._to.toHexString());

  tokenBalanceTo.amount = tokenBalanceTo.amount.plus(event.params._amount);
  tokenBalanceFrom.amount = tokenBalanceFrom.amount.minus(event.params._amount);

  tokenBalanceTo.save();
  tokenBalanceFrom.save();

  getOrCreateUser(event.params._to.toHexString());
  getOrCreateUser(event.params._from.toHexString());
}
