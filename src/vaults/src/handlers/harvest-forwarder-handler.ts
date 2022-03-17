import {
  TreeDistribution,
  TreeUpdate,
  OwnerUpdate,
  Sweep,
} from '../../generated/HarvestForwarder/HarvestForwarder';
import { TreeDistribution as TreeDistributionEntity } from '../../generated/schema';

export function handleTreeDistribution(event: TreeDistribution): void {
  const entity = new TreeDistributionEntity(event.transaction.from.toHex());

  entity.id = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  entity.token = event.params.token.toHex();
  entity.amount = event.params.amount;
  entity.blockNumber = event.params.block_number;
  entity.blockTimestamp = event.params.block_timestamp;
  entity.beneficiary = event.params.beneficiary.toHex();

  entity.save();
}

export function handleTreeUpdate(event: TreeUpdate): void {}

export function handleOwnerUpdate(event: OwnerUpdate): void {}

export function handleSweep(event: Sweep): void {}
