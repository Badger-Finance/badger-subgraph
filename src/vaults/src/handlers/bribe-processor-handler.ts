import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { TreeDistribution } from '../../generated/BribeProcessor/VotiumBribeProcessor';
import {
  ADDR_ZERO,
  ADDR_BVECVX,
  BADGER_SHARE,
  OPS_FEE,
  ADDR_BADGER,
  ADDR_BVECVX_LP,
} from '../constants';
import { loadBadgerTreeDistribution } from '../entities/badger-tree-distribution';

function determineBadgerSplit(totalAmount: BigInt): BigInt[] {
  let totalAmountDecimal = BigDecimal.fromString(totalAmount.toString());
  let percentBadgerbveCVX = 1 - (1 / BADGER_SHARE) * OPS_FEE;
  let decimalPercentBadgerbveCVX = BigDecimal.fromString(percentBadgerbveCVX.toString());
  let bveCVXAmount = BigInt.fromString(
    totalAmountDecimal.times(decimalPercentBadgerbveCVX).truncate(0).toString(),
  );
  let bveCVXLpAmount = totalAmount.minus(bveCVXAmount);
  return [bveCVXAmount, bveCVXLpAmount];
}

export function handleTreeDistribution(event: TreeDistribution): void {
  let amount = event.params.amount;
  let splitAmount = BigInt.fromString('0');

  if (event.params.token === ADDR_BADGER) {
    let totalBadgerAmounts = determineBadgerSplit(amount);
    amount = totalBadgerAmounts[0];
    splitAmount = totalBadgerAmounts[1];

    let lpDistribution = loadBadgerTreeDistribution(
      event.params.timestamp,
      event.params.blockNumber,
      splitAmount,
      event.params.token,
      event.transaction.hash,
      event.logIndex,
    );
    lpDistribution.sett = ADDR_BVECVX_LP.toHexString();
    lpDistribution.strategy = ADDR_ZERO.toHexString();

    lpDistribution.save();
  }

  let distribution = loadBadgerTreeDistribution(
    event.params.timestamp,
    event.params.blockNumber,
    amount,
    event.params.token,
    event.transaction.hash,
    event.logIndex,
  );
  distribution.sett = ADDR_BVECVX.toHexString();
  distribution.strategy = ADDR_ZERO.toHexString();

  distribution.save();
}
