import { TreeDistribution } from '../../generated/BribeProcessor/VotiumBribeProcessor';
import { BadgerTreeDistribution } from '../../generated/schema';
import { BVECVX } from '../constants';

export function handleTreeDistribution(event: TreeDistribution): void {
  let entity = new BadgerTreeDistribution(event.transaction.from.toHex());

  entity.id = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  entity.token = event.params.token.toHex();
  entity.amount = event.params.amount;
  entity.blockNumber = event.params.blockNumber;
  entity.sett = BVECVX;

  entity.save();
}
