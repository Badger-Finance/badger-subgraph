import {
  Approval,
  Harvested,
  PauseDeposits,
  Paused,
  SetGuardian,
  SetGuestList,
  SetManagementFee,
  SetMaxManagementFee,
  SetMaxPerformanceFee,
  SetMaxWithdrawalFee,
  SetPerformanceFeeGovernance,
  SetPerformanceFeeStrategist,
  SetStrategy,
  SetToEarnBps,
  SetTreasury,
  SetWithdrawalFee,
  Transfer,
  TreeDistribution,
  UnpauseDeposits,
  Unpaused,
} from '../../generated/templates/BadgerSettV1_5/BadgerSettV1_5';

import { SettType } from '../constants';
import { handleSettTokenTransfer } from './sett-handler';
import { loadBadgerTreeDistribution } from '../entities/badger-tree-distribution';
import { loadSettV1_5 } from '../entities/badger-sett-v1-5';
import { loadHarvestV1_5 } from '../entities/harvest';
import { loadStrategyV1_5 } from '../entities/strategy';
import { Address } from '@graphprotocol/graph-ts';
/* eslint-disable */
export function handleApproval(event: Approval): void {}

export function handleHarvested(event: Harvested): void {
  loadHarvestV1_5(event);
}

export function handlePauseDeposits(event: PauseDeposits): void {}

export function handlePaused(event: Paused): void {}

export function handleSetGuardian(event: SetGuardian): void {}

export function handleSetGuestList(event: SetGuestList): void {}

export function handleSetManagementFee(event: SetManagementFee): void {}

export function handleSetMaxManagementFee(event: SetMaxManagementFee): void {}

export function handleSetMaxPerformanceFee(event: SetMaxPerformanceFee): void {}

export function handleSetMaxWithdrawalFee(event: SetMaxWithdrawalFee): void {}

export function handleSetPerformanceFeeGovernance(
  event: SetPerformanceFeeGovernance,
): void {}

export function handleSetPerformanceFeeStrategist(
  event: SetPerformanceFeeStrategist,
): void {}

export function handleSetStrategy(event: SetStrategy): void {
  loadStrategyV1_5(event.address);
}

export function handleSetToEarnBps(event: SetToEarnBps): void {}

export function handleSetTreasury(event: SetTreasury): void {}

export function handleSetWithdrawalFee(event: SetWithdrawalFee): void {}

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  let hash = event.transaction.hash;
  handleSettTokenTransfer(
    hash,
    event.logIndex,
    timestamp,
    event.address,
    SettType.v1_5,
    from,
    to,
    value,
  );
}

export function handleTreeDistribution(event: TreeDistribution): void {
  let distribution = loadBadgerTreeDistribution(
    event.params.timestamp,
    event.params.blockNumber,
    event.params.amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );
  let sett = loadSettV1_5(event.address);
  distribution.sett = sett.id;
  distribution.strategy = sett.strategy;
  distribution.save();
}

export function handleUnpauseDeposits(event: UnpauseDeposits): void {}

export function handleUnpaused(event: Unpaused): void {}
