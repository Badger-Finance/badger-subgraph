import { TreeDistribution } from '../../generated/BribeProcessor/VotiumBribeProcessor';
import { ADDR_ZERO, ADDR_BVECVX } from '../constants';
import { loadSett } from '../entities/badger-sett';
import { loadBadgerTreeDistribution } from '../entities/badger-tree-distribution';
import { loadStrategy } from '../entities/strategy';

export function handleTreeDistribution(event: TreeDistribution): void {
  let distribution = loadBadgerTreeDistribution(
    event.params.timestamp,
    event.params.blockNumber,
    event.params.amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );

  let sett = loadSett(ADDR_BVECVX);
  distribution.sett = sett.id;
  let strat = loadStrategy(ADDR_ZERO);
  distribution.strategy = strat.id;

  distribution.save();
}
