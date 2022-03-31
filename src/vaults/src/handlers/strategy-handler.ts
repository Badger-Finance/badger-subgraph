import {
  ExtraRewardsTokenSet,
  Harvest,
  HarvestState,
  Paused,
  PerformanceFeeGovernance,
  PerformanceFeeStrategist,
  SetController,
  SetGovernance,
  SetPerformanceFeeGovernance,
  SetPerformanceFeeStrategist,
  SetStrategist,
  SetWithdrawalFee,
  Tend,
  TendState,
  TokenSwapPathSet,
  TreeDistribution,
  Unpaused,
  Withdraw,
  WithdrawAll,
  WithdrawOther,
  WithdrawState,
} from '../../generated/templates/BadgerStrategy/BadgerStrategy';
import { loadBadgerTreeDistribution, loadSushiTreeDistribution } from '../entities/badger-tree-distribution';
import { loadController } from '../entities/controller';
import { loadHarvest } from '../entities/harvest';
import { loadStrategy } from '../entities/strategy';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import { readValue } from '../entities/contracts';
/**
 * TODO: Create subgraph repository tickets around all availabe events.
 * Correctly track all aspects of strategies within the subgraph including
 * acitve controllers within the protocol, as well as all fees within the subgraph.
 *
 * Extenstions of this data are harvests, and tends for all strategies.
 */
/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

export function handleExtraRewardsTokenSet(event: ExtraRewardsTokenSet): void {}

export function handleHarvest(event: Harvest): void {
  loadHarvest(event);
}

export function handlePaused(event: Paused): void {}

export function handlePerformanceFeeGovernance(event: PerformanceFeeGovernance): void {}

export function handlePerformanceFeeStrategist(event: PerformanceFeeStrategist): void {}

export function handleSetController(event: SetController): void {
  let strategy = loadStrategy(event.address);
  strategy.controller = loadController(event.params.controller).id;
  strategy.save();
}

export function handleSetGovernance(event: SetGovernance): void {}

export function handleSetPerformanceFeeGovernance(
  event: SetPerformanceFeeGovernance,
): void {}

export function handleSetPerformanceFeeStrategist(
  event: SetPerformanceFeeStrategist,
): void {}

export function handleSetStrategist(event: SetStrategist): void {}

export function handleSetWithdrawalFee(event: SetWithdrawalFee): void {}

export function handleTend(event: Tend): void {}

export function handleTendState(event: TendState): void {}

export function handleTokenSwapPathSet(event: TokenSwapPathSet): void {}

export function handleTreeDistribution(event: TreeDistribution): void {
  let distribution = loadBadgerTreeDistribution(
    event.params.timestamp,
    event.params.blockNumber,
    event.params.amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );
  // Handle case where tree distribution event is duplicated for v1.5 vaults
  let maybeSett = BadgerSett.bind(event.address);
  let maybeName = readValue<string>(maybeSett.try_name(), '');
  if(maybeName.length > 0) {
    return;
  }
  let strategy = loadStrategy(event.address);
  distribution.strategy = strategy.id;
  distribution.sett = strategy.sett;
  distribution.save();
}

export function handleSushiTreeDistribution(event: HarvestState): void {
  let distribution = loadSushiTreeDistribution(event);
  let strategy = loadStrategy(event.address);
  distribution.strategy = strategy.id;
  distribution.sett = strategy.sett;
  distribution.save();
}

export function handleUnpaused(event: Unpaused): void {}

export function handleWithdraw(event: Withdraw): void {}

export function handleWithdrawAll(event: WithdrawAll): void {}

export function handleWithdrawOther(event: WithdrawOther): void {}

export function handleWithdrawState(event: WithdrawState): void {}
