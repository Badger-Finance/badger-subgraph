import { HarvestState } from '../../generated/harvestSushiWbtcEth/StrategySushiLpOptimizer';
import { getOrCreateSushiHarvestEvent } from '../utils/helpers/sushi/harvest';
export function handleSushiHarvest(event: HarvestState): void {
  let sushiHarvestID = event.address
    .toHexString()
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(event.logIndex.toString());

  let sushiHarvest = getOrCreateSushiHarvestEvent(sushiHarvestID, event);
  sushiHarvest.save();
}
