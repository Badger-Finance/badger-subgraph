import {Transfer} from '../../generated/Badger/MiniMeToken'
import {getOrCreateBadgerBalance} from '../utils/helpers/token/badger'
export function handleBadgerTransfer(event: Transfer): void {
    let fromAccount = getOrCreateBadgerBalance(event.params._from.toHexString());
    let toAccount = getOrCreateBadgerBalance(event.params._to.toHexString())
    fromAccount.balanceRaw = fromAccount.balanceRaw.minus(event.params._amount);
    toAccount.balanceRaw = toAccount.balanceRaw.plus(event.params._amount);
    
    fromAccount.save()
    toAccount.save()
}