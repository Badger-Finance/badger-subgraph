import { HarvestState } from '../../../../generated/harvestSushiWbtcEth/StrategySushiLpOptimizer';
import { SushiHarvestEvent } from '../../../../generated/schema';

export function getOrCreateSushiHarvestEvent(
  id: String,
  event: HarvestState,
): SushiHarvestEvent {
  let sushiHarvestEvent = SushiHarvestEvent.load(id.toString());
  if (sushiHarvestEvent == null) {
    sushiHarvestEvent = new SushiHarvestEvent(id.toString());
  }
  sushiHarvestEvent.xSushiHarvested = event.params.xSushiHarvested;
  sushiHarvestEvent.totalxSushi = event.params.totalxSushi;
  sushiHarvestEvent.toStrategist = event.params.toStrategist;
  sushiHarvestEvent.toGovernance = event.params.toGovernance;
  sushiHarvestEvent.toBadgerTree = event.params.toBadgerTree;
  sushiHarvestEvent.timestamp = event.params.timestamp;
  sushiHarvestEvent.blockNumber = event.params.blockNumber;

  return sushiHarvestEvent as SushiHarvestEvent;
}
