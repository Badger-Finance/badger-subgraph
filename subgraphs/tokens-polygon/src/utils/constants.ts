import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { toDecimal } from './decimals';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const GOVERNANCE_ADDRESS = '0xba37b002abafdd8e89a1995da52740bbc013d992';
export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = toDecimal(BigInt.fromI32(10).pow(18));
export const BIGDECIMAL_HUNDRED = toDecimal(BigInt.fromI32(10).pow(20));
