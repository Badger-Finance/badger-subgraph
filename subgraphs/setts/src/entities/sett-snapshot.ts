import { BigInt } from '@graphprotocol/graph-ts';
import { Sett, SettSnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY } from '../constants';

export function settSnapshotExists(timestamp: i32, sett: Sett): boolean {
  let day = timestamp / SECONDS_PER_DAY;
  let id = sett.id.concat('-').concat(BigInt.fromI32(day).toString());
  let snapshot = SettSnapshot.load(id);
  return snapshot != null;
}

export function loadSettSnapshot(timestamp: i32, sett: Sett): SettSnapshot {
  let day = timestamp / SECONDS_PER_DAY;
  let id = sett.id.concat('-').concat(BigInt.fromI32(day).toString());
  let snapshot = SettSnapshot.load(id);

  if (snapshot == null) {
    snapshot = new SettSnapshot(id);
    snapshot.name = sett.name;
    snapshot.symbol = sett.symbol;
    snapshot.decimals = sett.decimals;
    snapshot.token = sett.token;
    snapshot.timestamp = timestamp;
  }

  snapshot.balance = sett.balance;
  snapshot.totalSupply = sett.totalSupply;
  snapshot.pricePerFullShare = sett.pricePerFullShare;
  snapshot.netDeposit = sett.netDeposit;
  snapshot.netShareDeposit = sett.netShareDeposit;
  snapshot.grossDeposit = sett.grossDeposit;
  snapshot.grossShareDeposit = sett.grossShareDeposit;
  snapshot.grossWithdraw = sett.grossWithdraw;
  snapshot.grossShareWithdraw = sett.grossShareWithdraw;

  snapshot.save();
  return snapshot as SettSnapshot;
}
