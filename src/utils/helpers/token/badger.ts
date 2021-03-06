import { BadgerBalance } from '../../../../generated/schema'
import { BIGINT_ZERO } from '../../constants'
export function getOrCreateBadgerBalance(
    id: String,
): BadgerBalance {
    let badgerBalance = BadgerBalance.load(id.toString())
    if (badgerBalance == null) {
        badgerBalance = new BadgerBalance(id.toString())
        badgerBalance.balanceRaw = BIGINT_ZERO;
    }
    return badgerBalance as BadgerBalance

}