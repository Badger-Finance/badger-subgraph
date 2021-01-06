import { FarmHarvest } from '../../../../generated/harvestFarm/StrategyHarvestMetaFarm';
import { FarmHarvestEvent } from '../../../../generated/schema';

export function getOrCreateHarvestFarmEvent(
  id: String,
  event: FarmHarvest,
): FarmHarvestEvent {
  let farmHarvestEvent = FarmHarvestEvent.load(id.toString());
  if (farmHarvestEvent == null) {
    farmHarvestEvent = new FarmHarvestEvent(id.toString());
  }
  farmHarvestEvent.totalFarmHarvested = event.params.totalFarmHarvested;
  farmHarvestEvent.farmToRewards = event.params.farmToRewards;
  farmHarvestEvent.governancePerformanceFee = event.params.governancePerformanceFee;
  farmHarvestEvent.strategistPerformanceFee = event.params.strategistPerformanceFee;
  farmHarvestEvent.timestamp = event.params.timestamp;
  farmHarvestEvent.blockNumber = event.params.blockNumber;

  return farmHarvestEvent as FarmHarvestEvent;
}
