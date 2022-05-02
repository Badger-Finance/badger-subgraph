import { TreeDistribution } from '../../generated/BribeProcessor/VotiumBribeProcessor';
import { BVECVX, ADDR_ZERO } from '../constants';
import { loadBadgerTreeDistribution } from '../entities/badger-tree-distribution';

export function handleTreeDistribution(event: TreeDistribution): void {
  let distribution = loadBadgerTreeDistribution(
    event.params.timestamp,
    event.params.blockNumber,
    event.params.amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );
  distribution.sett = BVECVX;
  distribution.strategy = ADDR_ZERO.toHexString();

  distribution.save();
}
