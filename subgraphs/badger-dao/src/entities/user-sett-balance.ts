import { BigInt } from '@graphprotocol/graph-ts';
import { Sett, User, UserSettBalance } from '../../generated/schema';
import { ZERO } from '../constants';

export function loadUserBalance(user: User, sett: Sett): UserSettBalance {
  let id = user.id.concat('-').concat(sett.id);
  let settBalance = UserSettBalance.load(id);

  if (settBalance == null) {
    settBalance = new UserSettBalance(id);
    settBalance.sett = sett.id;
    settBalance.user = user.id;
    settBalance.netDeposit = ZERO;
    settBalance.grossDeposit = ZERO;
    settBalance.grossWithdraw = ZERO;
    settBalance.netShareDeposit = ZERO;
    settBalance.grossShareDeposit = ZERO;
    settBalance.grossShareWithdraw = ZERO;
  }

  settBalance.save();
  return settBalance as UserSettBalance;
}

export function depositBalance(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.plus(token);
  userBalance.grossDeposit = userBalance.grossDeposit.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.plus(share);
  userBalance.grossShareDeposit = userBalance.grossShareDeposit.plus(share);
  userBalance.save();
}

export function withdrawBalance(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.minus(token);
  userBalance.grossWithdraw = userBalance.grossWithdraw.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.minus(share);
  userBalance.grossShareWithdraw = userBalance.grossShareWithdraw.plus(share);
  userBalance.save();
}
