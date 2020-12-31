import { FarmHarvest } from '../../generated/harvestFarm/StrategyHarvestMetaFarm';
import { getOrCreateHarvestFarmEvent } from '../utils/helpers/farm/harvest';
export function handleFarmHarvest(event: FarmHarvest): void {
  let farmHarvestID = event.address.toString()

  let farmHarvest = getOrCreateHarvestFarmEvent(farmHarvestID, event);
  farmHarvest.save();
}
