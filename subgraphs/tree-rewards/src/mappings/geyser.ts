import { Staked, Unstaked } from '../../generated/nativeBadgerGeyser/BadgerGeyser';
import {
  getOrCreateGeyser,
  getOrCreateGeyserStakedEvent,
  getOrCreateGeyserUnstakedEvent,
} from '../utils/helpers/geyser/geyser';

export function handleStaked(event: Staked): void {
  // Generate a new stake for the geyser
  let stakeId = event.address
    .toHexString()
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(event.logIndex.toString());

  let geyser = getOrCreateGeyser(event.address);
  geyser.save();

  let stake = getOrCreateGeyserStakedEvent(stakeId, geyser.id, event);
  stake.save();
}

export function handleUnstaked(event: Unstaked): void {
  //
  let unstakeId = event.address
    .toHexString()
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(event.logIndex.toString());

  let geyser = getOrCreateGeyser(event.address);
  geyser.save();

  // Update accounting, processing unstake according to LIFO rules
  // geyser.accounts
  // Get the account for the user in question
  // Remove from most recent stakes first
  let unstake = getOrCreateGeyserUnstakedEvent(unstakeId, geyser.id, event);
  unstake.save();
}
