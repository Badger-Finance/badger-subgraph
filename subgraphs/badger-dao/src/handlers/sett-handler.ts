import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { Transfer } from '../../generated/templates/SettVault/BadgerSett';
import { NO_ADDR, SettType } from '../constants';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadSett } from '../entities/badger-sett';
import { loadSettV2 } from '../entities/badger-sett-v2';
import { loadSettSnapshot } from '../entities/sett-snapshot';
import { isValidUser, loadUser } from '../entities/user';
import { depositBalance, loadUserBalance, withdrawBalance } from '../entities/user-sett-balance';

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  handleSettTokenTransfer(timestamp, event.address, SettType.v1, from, to, value);
}

export function depositSett(timestamp: i32, sett: Sett, share: BigInt, token: BigInt): void {
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);
  sett.save();
  loadSettSnapshot(timestamp, sett);
}

export function withdrawSett(timestamp: i32, sett: Sett, share: BigInt, token: BigInt): void {
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);
  sett.save();
  loadSettSnapshot(timestamp, sett);
}

export function handleSettTokenTransfer(
  timestamp: i32,
  settAddress: Address,
  settType: SettType,
  fromAddress: Address,
  toAddress: Address,
  share: BigInt,
): void {
  // load appropriate sett
  let sett: Sett;
  switch (settType) {
    case SettType.Affiliate:
      sett = loadAffiliateSett(settAddress);
      break;
    case SettType.v2:
      sett = loadSettV2(settAddress);
      break;
    case SettType.v1:
    default:
      sett = loadSett(settAddress);
  }
  // get relevant entities
  let from = loadUser(fromAddress);
  let to = loadUser(toAddress);

  // get share and token values
  let token = share.times(sett.pricePerFullShare).div(BigInt.fromI32(10).pow(<u8>sett.decimals));

  // get user balances
  let fromBalance = loadUserBalance(from, sett);
  let toBalance = loadUserBalance(to, sett);

  // deposit
  if (fromAddress.toHexString() == NO_ADDR) {
    depositBalance(toBalance, share, token);
    depositSett(timestamp, sett, share, token);
  }

  // withdrawal
  if (toAddress.toHexString() == NO_ADDR) {
    withdrawBalance(fromBalance, share, token);
    withdrawSett(timestamp, sett, share, token);
  }

  // transfer
  if (isValidUser(from.id) && isValidUser(to.id)) {
    withdrawBalance(fromBalance, share, token);
    depositBalance(toBalance, share, token);
  }
}
