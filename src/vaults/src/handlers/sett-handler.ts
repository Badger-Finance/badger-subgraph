import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { Transfer } from '../../generated/templates/SettVault/BadgerSett';
import { NO_ADDR, SettType } from '../constants';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadSett } from '../entities/badger-sett';
import { loadSettV1_5 } from '../entities/badger-sett-v1-5';
import { loadSettSnapshot } from '../entities/sett-snapshot';
import { loadTransfer } from '../entities/transfer';
import { isValidUser, loadUser } from '../entities/user';
import {
  depositBalance,
  loadUserBalance,
  withdrawBalance,
} from '../entities/user-sett-balance';

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  let hash = event.transaction.hash;
  let index = event.logIndex;
  handleSettTokenTransfer(
    hash,
    index,
    event.block.timestamp,
    event.block.number,
    event.address,
    SettType.v1,
    from,
    to,
    value,
  );
}

export function depositSett(
  timestamp: i32,
  sett: Sett,
  share: BigInt,
  token: BigInt,
): void {
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);
  sett.save();
  loadSettSnapshot(timestamp, sett);
}

export function withdrawSett(
  timestamp: i32,
  sett: Sett,
  share: BigInt,
  token: BigInt,
): void {
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);
  sett.save();
  loadSettSnapshot(timestamp, sett);
}

export function handleSettTokenTransfer(
  hash: Bytes,
  index: BigInt,
  eventTime: BigInt,
  block: BigInt,
  settAddress: Address,
  settType: SettType,
  fromAddress: Address,
  toAddress: Address,
  share: BigInt,
): void {
  let timestamp = eventTime.toI32();
  // load appropriate sett
  let sett: Sett;
  switch (settType) {
    case SettType.Affiliate:
      sett = loadAffiliateSett(settAddress, block, eventTime);
      break;
    case SettType.v1_5:
      sett = loadSettV1_5(settAddress, block, eventTime);
      break;
    case SettType.v1:
    default:
      sett = loadSett(settAddress, block, eventTime);
  }

  loadTransfer(hash, index, timestamp, sett.id, fromAddress, toAddress, share);

  // get relevant entities
  let from = loadUser(fromAddress);
  let to = loadUser(toAddress);

  // get share and token values
  let token = share
    .times(sett.pricePerFullShare)
    .div(BigInt.fromI32(10).pow(<u8>sett.decimals.toI32()));

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
