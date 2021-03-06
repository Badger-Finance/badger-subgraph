import {Transfer} from '../../generated/Digg/UFragments'
import {getOrCreateDiggBalance} from '../utils/helpers/token/digg'
export function handleDiggTransfer(event: Transfer): void {
    let fromAccount = getOrCreateDiggBalance(event.params.from.toHexString());
    let toAccount = getOrCreateDiggBalance(event.params.to.toHexString())
    fromAccount.balanceRaw = fromAccount.balanceRaw.minus(event.params.value);
    toAccount.balanceRaw = toAccount.balanceRaw.plus(event.params.value);
    
    fromAccount.save()
    toAccount.save()
}