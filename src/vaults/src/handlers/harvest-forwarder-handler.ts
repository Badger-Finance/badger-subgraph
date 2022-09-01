import { TreeDistribution } from '../../generated/HarvestForwarder/HarvestForwarder';
import { ADDR_ZERO } from '../constants';
import { loadBadgerTreeDistribution } from '../entities/badger-tree-distribution';

export function handleTreeDistribution(event: TreeDistribution): void {
  let distribution = loadBadgerTreeDistribution(
    event.params.block_timestamp,
    event.params.block_number,
    event.params.amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );
  distribution.sett = event.params.beneficiary.toHexString();
  distribution.strategy = ADDR_ZERO.toHexString();

  distribution.save();
}

// export function handleTreeUpdate(event: TreeUpdate): void {}

// export function handleOwnerUpdate(event: OwnerUpdate): void {}

// export function handleSweep(event: Sweep): void {}
