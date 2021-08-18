import { TreeDistribution } from '../../generated/harvestCrvATricrypto/StrategySushiBadgerIbBTC';
import { getOrCreateTreeDistribution } from '../utils/helpers/tree/distribution';

export function handleTreeDistribution(event: TreeDistribution): void {
  let treeDistributionID = event.address
    .toHexString()
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(event.logIndex.toString());
  let treeDistribution = getOrCreateTreeDistribution(treeDistributionID, event);
  treeDistribution.save();
}
