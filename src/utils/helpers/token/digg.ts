import { DiggBalance } from '../../../../generated/schema';
import { BIGINT_ZERO } from '../../constants';
export function getOrCreateDiggBalance(id: String): DiggBalance {
  let badgerBalance = DiggBalance.load(id.toString());
  if (badgerBalance == null) {
    badgerBalance = new DiggBalance(id.toString());
    badgerBalance.balanceRaw = BIGINT_ZERO;
  }
  return badgerBalance as DiggBalance;
}
