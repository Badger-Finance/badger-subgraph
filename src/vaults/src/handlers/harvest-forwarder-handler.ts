import {
  TreeDistribution,
  TreeUpdate,
  OwnerUpdate,
  Sweep,
} from '../../generated/HarvestForwarder/HarvestForwarder';
import { BadgerTreeDistribution } from '../../generated/schema';

export function handleTreeDistribution(event: TreeDistribution): void {
  let entity = new BadgerTreeDistribution(event.transaction.from.toHex());

  entity.id = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  entity.token = event.params.token.toHex();
  entity.amount = event.params.amount;
  entity.blockNumber = event.params.block_number;
  entity.sett = event.params.beneficiary.toHex();

  entity.save();
}

export function handleTreeUpdate(event: TreeUpdate): void {}

export function handleOwnerUpdate(event: OwnerUpdate): void {}

export function handleSweep(event: Sweep): void {}
