import { Address } from '@graphprotocol/graph-ts';

import { getOrCreateTokenBalance } from '../utils/helpers/token/balance';
import { Transfer } from '../../generated/ibBTC/bBTC'
export function handleIbBTCTransfer(event: Transfer): void {
    let ibbtcToken = Address.fromString('0xc4e15973e6ff2a35cc804c2cf9d2a1b817a8b40f');
    let fromId = event.params.from
        .toHexString()
        .concat('-')
        .concat(ibbtcToken.toHexString());
    let toId = event.params.to.toHexString().concat('-').concat(ibbtcToken.toHexString());

    let fromAccount = getOrCreateTokenBalance(fromId, ibbtcToken);
    let toAccount = getOrCreateTokenBalance(toId, ibbtcToken);

    fromAccount.balance = fromAccount.balance.minus(event.params.value);
    toAccount.balance = toAccount.balance.plus(event.params.value);

    fromAccount.save();
    toAccount.save();
}

