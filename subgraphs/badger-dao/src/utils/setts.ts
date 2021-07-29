import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { NO_ADDR, NORMALIZER } from '../constants';
import { loadSett } from '../entities/badger-sett';
import { loadSettV2 } from '../entities/badger-sett-v2';
import { isValidUser, loadUser } from '../entities/user';
import { depositBalance, loadUserBalance, withdrawBalance } from '../entities/user-sett-balance';

export function depositSett(sett: Sett, share: BigInt, token: BigInt): void {
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);
  sett.save();
}

export function withdrawSett(sett: Sett, share: BigInt, token: BigInt): void {
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);
  sett.save();
}

export function handleSettTokenTransfer(
  settAddress: Address,
  fromAddress: Address,
  toAddress: Address,
  share: BigInt,
  legacy: boolean = false,
): void {
  // get relevant entities
  let sett = legacy ? loadSett(settAddress) : loadSettV2(settAddress);
  let from = loadUser(fromAddress);
  let to = loadUser(toAddress);

  // get share and token values
  let token = share.times(sett.pricePerFullShare).div(NORMALIZER);

  // get user balances
  let fromBalance = loadUserBalance(from, sett);
  let toBalance = loadUserBalance(to, sett);

  // deposit
  if (fromAddress.toHexString() == NO_ADDR) {
    depositBalance(toBalance, share, token);
    depositSett(sett, share, token);
  }

  // withdrawal
  if (toAddress.toHexString() == NO_ADDR) {
    withdrawBalance(fromBalance, share, token);
    withdrawSett(sett, share, token);
  }

  // transfer
  if (isValidUser(from.id) && isValidUser(to.id)) {
    withdrawBalance(fromBalance, share, token);
    depositBalance(toBalance, share, token);
  }
}
