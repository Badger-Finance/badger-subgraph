import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BadgerTreeDistribution } from '../../generated/schema';
import {
  HarvestState,
} from '../../generated/templates/BadgerStrategy/BadgerStrategy';

import { XSUSHI } from '../constants';
import { loadToken } from './token';

export function loadBadgerTreeDistribution(
  id: string,
  timestamp: BigInt,
  blockNumber: BigInt,
  amount: BigInt,
  token: Address
): BadgerTreeDistribution {
  let distribution = BadgerTreeDistribution.load(id) as BadgerTreeDistribution;
  if (distribution) {
    return distribution;
  }
  distribution = new BadgerTreeDistribution(id);
  distribution.timestamp = timestamp.toI32()
  distribution.blockNumber = blockNumber
  distribution.amount = amount
  distribution.token = loadToken(token).id;
  distribution.save();
  return distribution;
}

export function loadSushiTreeDistribution(event: HarvestState): BadgerTreeDistribution {
  let id = event.transaction.hash
    .toHexString()
    .concat('-')
    .concat(event.logIndex.toString());
  let distribution = BadgerTreeDistribution.load(id) as BadgerTreeDistribution;
  if (distribution) {
    return distribution;
  }
  distribution = new BadgerTreeDistribution(id);
  distribution.timestamp = event.params.timestamp.toI32();
  distribution.blockNumber = event.params.blockNumber;
  distribution.amount = event.params.toBadgerTree;
  distribution.token = loadToken(Address.fromString(XSUSHI)).id;
  distribution.save();
  return distribution;
}
