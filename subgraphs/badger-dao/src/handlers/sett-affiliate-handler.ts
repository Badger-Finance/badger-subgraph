import { BigInt } from '@graphprotocol/graph-ts';
import {
  Burn,
  Deposit,
  Mint,
  Transfer,
  UpdateGuestList,
  Withdraw,
} from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadUser } from '../entities/user';
import { depositBalance, loadUserBalance, withdrawBalance } from '../entities/user-sett-balance';
import { depositSett, withdrawSett } from '../utils/setts';

export function handleBurn(event: Burn): void {
  let account = loadUser(event.params.account);
  let sett = loadAffiliateSett(event.address);
  let share = event.params.shares;
  withdrawSett(sett, share, BigInt.fromI32(0));

  let balance = loadUserBalance(account, sett);
  withdrawBalance(balance, share, BigInt.fromI32(0));
}

export function handleDeposit(event: Deposit): void {
  let account = loadUser(event.params.account);
  let sett = loadAffiliateSett(event.address);
  let token = event.params.amount;
  depositSett(sett, BigInt.fromI32(0), token);

  let balance = loadUserBalance(account, sett);
  depositBalance(balance, BigInt.fromI32(0), token);
}

export function handleMint(event: Mint): void {
  let account = loadUser(event.params.account);
  let sett = loadAffiliateSett(event.address);
  let share = event.params.shares;
  depositSett(sett, share, BigInt.fromI32(0));

  let balance = loadUserBalance(account, sett);
  depositBalance(balance, share, BigInt.fromI32(0));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleTransfer(event: Transfer): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleUpdateGuestList(event: UpdateGuestList): void {}

export function handleWithdraw(event: Withdraw): void {
  let account = loadUser(event.params.account);
  let sett = loadAffiliateSett(event.address);
  let token = event.params.amount;
  withdrawSett(sett, BigInt.fromI32(0), token);

  let balance = loadUserBalance(account, sett);
  withdrawBalance(balance, BigInt.fromI32(0), token);
}
