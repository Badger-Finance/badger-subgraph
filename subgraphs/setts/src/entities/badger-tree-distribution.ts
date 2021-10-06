import { BadgerTreeDistribution } from '../../generated/schema';
import { TreeDistribution } from '../../generated/templates/BadgerStrategy/BadgerStrategy';
import { loadToken } from './token';

export function loadBadgerTreeDistribution(
  event: TreeDistribution,
): BadgerTreeDistribution {
  const id = event.transaction.hash
    .toHexString()
    .concat('-')
    .concat(event.logIndex.toString());
  let distriubtion = BadgerTreeDistribution.load(id) as BadgerTreeDistribution;
  if (distriubtion) {
    return distriubtion;
  }
  distriubtion = new BadgerTreeDistribution(id);
  distriubtion.timestamp = event.params.timestamp.toI32();
  distriubtion.blockNumber = event.params.blockNumber;
  distriubtion.amount = event.params.amount;
  distriubtion.token = loadToken(event.params.token).id;
  distriubtion.save();
  return distriubtion;
}
