import { Address } from '@graphprotocol/graph-ts';

import { TreeDistribution as TreeDistributionEvent } from '../../../../generated/harvestCrvATricrypto/StrategySushiBadgerIbBTC';
import { TreeDistribution as TreeDistributionEntity } from '../../../../generated/schema';
import { getOrCreateToken } from './token';

export function getOrCreateTreeDistribution(
  id: String,
  event: TreeDistributionEvent,
): TreeDistributionEntity {
  let treeDistribution = TreeDistributionEntity.load(id.toString());
  if (treeDistribution == null) {
    treeDistribution = new TreeDistributionEntity(id.toString());
  }
  let tokenAddress: Address = event.params.token;
  let token = getOrCreateToken(tokenAddress);
  treeDistribution.amount = event.params.amount;
  treeDistribution.blockNumber = event.params.blockNumber;
  treeDistribution.timestamp = event.params.timestamp;
  treeDistribution.token = token.id;

  return treeDistribution as TreeDistributionEntity;
}
