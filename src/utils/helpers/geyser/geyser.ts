import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
  BadgerGeyser,
  Staked,
  Unstaked,
} from '../../../../generated/nativeBadgerGeyser/BadgerGeyser';
import {
  Geyser,
  StakedEvent,
  Transaction,
  UnstakedEvent,
} from '../../../../generated/schema';
import { BIGINT_ZERO } from '../../constants';

export function getOrCreateTransaction(
  id: String,
  createIfNotFound: boolean = true,
): Transaction {
  // @ts-ignore: assign wrapper object to primitive
  let transaction = Transaction.load(id);

  if (transaction == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    transaction = new Transaction(id);
  }

  return transaction as Transaction;
}

export function getOrCreateGeyserStakedEvent(
  id: String,
  gesyerId: String,
  event: Staked,
): StakedEvent {
  let stake = StakedEvent.load(id.toString());
  if (stake == null) {
    stake = new StakedEvent(id.toString());
  }

  stake.amount = event.params.amount;
  stake.geyser = gesyerId.toString();
  stake.user = event.params.user;
  stake.total = event.params.total;
  stake.timestamp = event.params.timestamp;
  stake.blockNumber = event.params.blockNumber;
  stake.data = event.params.data;

  return stake as StakedEvent;
}

export function getOrCreateGeyserUnstakedEvent(
  id: String,
  gesyerId: String,
  event: Unstaked,
): UnstakedEvent {
  let unstake = UnstakedEvent.load(id.toString());
  if (unstake == null) {
    unstake = new UnstakedEvent(id.toString());
  }

  unstake.amount = event.params.amount;
  unstake.geyser = gesyerId.toString();
  unstake.user = event.params.user;
  unstake.total = event.params.total;
  unstake.timestamp = event.params.timestamp;
  unstake.blockNumber = event.params.blockNumber;
  unstake.data = event.params.data;
  return unstake as UnstakedEvent;
}

export function getOrCreateGeyser(
  geyserAddress: Address,
  update: boolean = true,
): Geyser {
  let geyser = Geyser.load(geyserAddress.toHexString());
  let geyserContract = BadgerGeyser.bind(geyserAddress);

  if (geyser == null) {
    geyser = new Geyser(geyserAddress.toHexString());
    geyser.totalStaked = BIGINT_ZERO;
  }

  if (update) {
    let totalStaked = geyserContract.try_totalStaked();
    geyser.totalStaked = !totalStaked.reverted ? totalStaked.value : new BigInt(0);
  }

  return geyser as Geyser;
}
