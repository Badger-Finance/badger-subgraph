import { Address } from '@graphprotocol/graph-ts';
import { BadgerTreeDistribution } from '../../generated/schema';
import { HarvestState, TreeDistribution } from '../../generated/templates/BadgerStrategy/BadgerStrategy';
import { XSUSHI } from '../constants';
import { loadToken } from './token';

export function loadBadgerTreeDistribution(
  event: TreeDistribution,
): BadgerTreeDistribution {
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
  distribution.amount = event.params.amount;
  distribution.token = loadToken(event.params.token).id;
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